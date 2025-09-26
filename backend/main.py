from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
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

# OpenAI client
client = OpenAI(api_key="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")

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
        # Create a detailed prompt for OpenAI
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

        Provide your response in the following JSON format:
        {{
            "status": "Legal/Uncertain/Illegal",
            "reasoning": "Detailed explanation of your decision",
            "confidence": 0.85
        }}

        Be thorough in your analysis and provide specific reasoning based on Swiss regulations.
        """

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in Swiss import and sales regulations. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        # Parse the response
        result_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        import json
        import re
        
        # Look for JSON in the response
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group())
                return ProductResponse(
                    status=result.get("status", "Uncertain"),
                    reasoning=result.get("reasoning", "Analysis completed"),
                    confidence=result.get("confidence", 0.5)
                )
            except json.JSONDecodeError:
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
