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
            You are a meticulous Swiss import compliance expert. Decide whether a product is Legal, Illegal, or Uncertain for import and private possession in Switzerland.

            Product URL: {request.url}

            Procedure:

            Fetch & parse the page: title, category, specs (power/class, materials, chemical concentrations, age/weapon claims), warnings, and any image alt text. Note missing/ambiguous data.

            Normalize category (examples): laser_pointer, signal_jammer, stun_gun, knife_switchblade, fireworks_F3/F4, radar_detector, weapon_accessory, chemical, toy, electronics, cosmetic, food, other.

            Check against official Swiss sources (only):

            FOCBS/BAZG: https://www.bazg.admin.ch/

            Fedlex: https://www.fedlex.admin.ch/

            FOPH/BAG (health/chemicals/safety)
            Prefer explicit, current rules; quote them briefly in reasoning.

            Decision rules

            Illegal: Clear, specific match to a prohibited category/spec (e.g., laser pointer not explicitly Class 1; signal/Wi-Fi/GPS jammer; stun gun/taser; switchblade/balisong; high-category fireworks F3/F4/P2; radar detector; firearm suppressor; banned chemicals/concentrations).

            Legal: No conflicts found and product appears compliant (or ordinary goods) given the parsed specs and official guidance.

            STATUS OUTPUT BASED ON CONFIDENCE:
            - Confidence ≥ 0.5: "possibly legal" or "possibly illegal"
            - Confidence < 0.5: "likely legal" or "likely illegal"
            - Never use "uncertain" - always choose legal or illegal based on available evidence

            Confidence (0–1) - Base on product type and evidence quality:

            0.80–0.95: Clear prohibited items with explicit specs (laser class 3+, weapons, dangerous chemicals) OR clearly safe common products (basic clothing, simple accessories) with no concerning materials mentioned.

            0.60–0.79: Common products (electronics, toys, cosmetics) with some uncertainty about materials/certifications but no obvious violations.

            0.40–0.59: Ambiguous products with missing key specs or conflicting information.

            0.10–0.39: Very unclear product type or insufficient information.

            CONFIDENCE GUIDELINES BY PRODUCT TYPE:
            - Basic clothing/textiles (t-shirts, pants, basic accessories): 0.7-0.8 (generally safe unless toxic materials mentioned)
            - Simple electronics (phone cases, cables, basic gadgets, chargers): 0.6-0.7 (generally safe, common consumer items)
            - Toys/games: 0.5-0.6 (age restrictions and safety concerns)
            - Cosmetics/chemicals: 0.4-0.6 (depends on ingredients and concentrations)
            - Weapons/dangerous items: 0.8-0.9 (clearly prohibited)
            - Generic/unclear products: 0.3-0.5 (insufficient information)

            IMPORTANT: For common consumer products (clothing, phone cases, basic electronics) that don't contain prohibited keywords, use confidence 0.6-0.8 unless there are specific safety concerns mentioned.

            Keywords in URL are signals only, not decisive; confirm with page content and/or official sources.

            Do not invent laws. If no official citation applies, state that and prefer Uncertain over guessing.

            Output (STRICT JSON ONLY — no extra text)

            Return exactly one JSON object:

            "status": "possibly legal | possibly illegal | likely legal | likely illegal",
            "reasoning": "2–5 sentences, factual, referencing page specs and official guidance (cite source names/URLs briefly).",
            "confidence": 0.0,
            "category": "normalized_product_type",
            "matched_rules": ["laser-pointer-class>1", "signal-jammer", "stun-gun", "knife-switchblade", "fireworks-F3/F4", "radar-detector", "weapon-accessory", "chemical-restriction", "safety-cert-missing"],
            "evidence": [
            "verbatim/near-verbatim snippet from the product page (e.g., '5 mW green laser 303')",
            "second snippet if available"
            ],
            "missing_information": ["which spec/document would resolve uncertainty (e.g., laser class, CE conformity, ingredient %)"],
            "fetch_error": false

            Return ONLY valid JSON. No markdown, no prose outside the JSON.
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
