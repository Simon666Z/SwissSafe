from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import json
import re
from typing import Dict, Any

app = FastAPI(title="StaySafe API", description="AI-based tool to check product legality in Switzerland")

# cors config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# apertus client
client = OpenAI(
    api_key=os.getenv("SWISS_AI_PLATFORM_API_KEY", "khPqGsNrtVsaL5lWoyhChUuvwEGr"),
    base_url="https://api.swisscom.com/layer/swiss-ai-weeks/apertus-70b/v1"
)

class ProductRequest(BaseModel):
    url: str

class ProductResponse(BaseModel):
    status: str  # "legal", "illegal", "possibly legal", "possibly illegal", "likely legal", "likely illegal"
    reasoning: str
    confidence: float

@app.get("/")
async def root():
    return {"message": "StaySafe API - Check product legality in Switzerland"}

@app.post("/check-product", response_model=ProductResponse)
async def check_product(request: ProductRequest):
    """
    check if product is legal for switzerland
    """
    try:
        # create prompt for apertus
        prompt = f"""
            You are a meticulous Swiss import compliance expert. Decide whether a product is Legal, Illegal, or Uncertain for import and private possession in Switzerland.
            Is it illegal to import this into switzerland? Product URL: {request.url}

            Return exactly one JSON object:

            "status": "legal | possibly legal | possibly illegal | illegal | likely legal | likely illegal",
            "reasoning": "2–5 sentences, factual, referencing page specs and official guidance (cite source names/URLs briefly).",
            "confidence": 0.0,  # 0.0 to 1.0

            Return ONLY valid JSON. No markdown, no prose outside the JSON.
        """

        # call apertus api
        try:
            response = client.chat.completions.create(
                model="swiss-ai/Apertus-70B",
                messages=[
                    {"role": "system", "content": "You are an expert in Swiss import and sales regulations. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.9,
                max_tokens=50000
            )
        except Exception as api_error:
            return ProductResponse(
                status="Uncertain",
                reasoning=f"API error: {str(api_error)}",
                confidence=0.1
            )

        # parse response
        result_text = response.choices[0].message.content.strip()
        
        # try to extract json
        import json
        import re
        
        # first try parsing entire response
        try:
            result = json.loads(result_text)
            if isinstance(result, dict) and "status" in result:
                return ProductResponse(
                    status=result.get("status", "Uncertain"),
                    reasoning=result.get("reasoning", "Analysis completed"),
                    confidence=result.get("confidence", 0.5)
                )
        except json.JSONDecodeError:
            pass
        
        # if that fails, look for json in response
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            try:
                json_text = json_match.group()
                result = json.loads(json_text)
                return ProductResponse(
                    status=result.get("status", "Uncertain"),
                    reasoning=result.get("reasoning", "Analysis completed"),
                    confidence=result.get("confidence", 0.5)
                )
            except json.JSONDecodeError as e:
                pass
        
        # fallback if json parsing fails
        return ProductResponse(
            status="Uncertain",
            reasoning="Unable to parse AI response. Please try again.",
            confidence=0.3
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
