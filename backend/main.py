from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import json
import re
from typing import Dict, Any

app = FastAPI(title="StaySafe API", description="AI-based tool to check product legality in Switzerland")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Swiss AI Platform Apertus client
client = OpenAI(
    api_key=os.getenv("SWISS_AI_PLATFORM_API_KEY", "khPqGsNrtVsaL5lWoyhChUuvwEGr"),
    base_url="https://api.swisscom.com/layer/swiss-ai-weeks/apertus-70b/v1"
)

class ProductRequest(BaseModel):
    url: str

class ProductResponse(BaseModel):
    status: str  # "Legal", "Uncertain", or "Illegal"
    reasoning: str
    confidence: float

@app.get("/")
async def root():
    return {"message": "StaySafe API - Check product legality in Switzerland"}

@app.post("/check-product", response_model=ProductResponse)
async def check_product(request: ProductRequest):
    """
    Check if a product from TEMU or SHEIN is legal for sale/import in Switzerland
    """
    try:
        # Create a detailed prompt for Swiss AI Platform Apertus
        prompt = f"""
        You are an expert in Swiss import and sales regulations. Analyze the following product URL and determine if the product is legal for sale or import in Switzerland.

        Product URL: {request.url}

        Based on Swiss law and regulations, classify this product as one of the following:
        - "Legal": The product is clearly allowed for sale/import in Switzerland
        - "Uncertain": There's insufficient information or the product may have restrictions
        - "Illegal": The product is prohibited for sale/import in Switzerland

        Consider these factors:
        1. Product type and category
        2. Swiss import restrictions
        3. Safety regulations
        4. Prohibited items (e.g., class 2+ laser pointers, certain electronics, etc.)
        5. Age restrictions
        6. Chemical/biological restrictions

        IMPORTANT: You must respond with ONLY valid JSON in exactly this format:
        {{
            "status": "Legal",
            "reasoning": "Detailed explanation of your decision",
            "confidence": 0.85
        }}

        Do not include any text before or after the JSON. Do not use markdown formatting. Return only the JSON object.
        """

        # Call Swiss AI Platform Apertus API
        try:
            response = client.chat.completions.create(
                model="swiss-ai/Apertus-70B",
                messages=[
                    {"role": "system", "content": "You are an expert in Swiss import and sales regulations. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
        except Exception as api_error:
            return ProductResponse(
                status="Uncertain",
                reasoning=f"API error: {str(api_error)}",
                confidence=0.1
            )

        # Parse the response
        result_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        import json
        import re
        
        # First, try to parse the entire response as JSON
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
        
        # If that fails, look for JSON in the response
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
        
        # Fallback if JSON parsing fails
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
