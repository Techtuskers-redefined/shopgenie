import pandas as pd
import openai   

def query_openai_for_ingredients(user_prompt):
    import openai
    openai.api_key = "your-api-key-here"  # Replace with your actual API key or use environment variable
    """
    Uses OpenAI API to extract ingredients and quantities from a user's natural language command.
    Returns a list of dicts: [{'ingredient': ..., 'quantity': ...}, ...]
    """
    system_message = (
        "You are an AI assistant that extracts a list of grocery ingredients and their quantities "
        "needed for cooking from a user's request. Respond ONLY with a JSON list of objects, each "
        "with 'ingredient' and 'quantity' fields. Example: "
        "[{\"ingredient\": \"rice\", \"quantity\": \"500g\"}, ...]"
    )
    user_message = f"What ingredients do I need to {user_prompt}?"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5
        )
        import json
        content = response['choices'][0]['message']['content']
        # Parse the JSON output from the model
        ingredients = json.loads(content)
        return ingredients
    except Exception as e:
        print("Error:", e)
        # Fallback: return a sample list
        return [
            {"ingredient": "rice", "quantity": "500g"},
            {"ingredient": "soy sauce", "quantity": "100ml"},
            {"ingredient": "chicken", "quantity": "1kg"}
        ]

def load_inventory_data(file_path):
    """
    Loads the inventory CSV into a pandas DataFrame.
    """
    return pd.read_csv(file_path)

def match_products_to_inventory(ingredient_list, inventory_df, max_results_per_item=2):
    """
    For each ingredient, finds up to max_results_per_item matching products in the inventory.
    Returns a list of dicts with product and ingredient details.
    """
    matched = []
    for item in ingredient_list:
        matches = inventory_df[
            inventory_df['tags'].str.contains(item['ingredient'], case=False, na=False)
        ][:max_results_per_item]
        for _, row in matches.iterrows():
            matched.append({
                'ingredient': item['ingredient'],
                'quantity': item.get('quantity', ''),
                'name': row['name'],
                'brand': row['brand'],
                'price': row['price'],
                'discount': row.get('discount_percent', 0.0),
                'aisle': row['aisle'],
                'category': row['category'],
                'image_url': row['image_url']
            })
    return matched

if __name__ == "__main__":
    # Load inventory database
    df = load_inventory_data('recommender_system/walmart_mock_products_1000_with_images.csv')

    # Get user input (could be replaced with input() for interactive use)
    user_input = "chinese for four"

    # Step 1: Extract ingredients and quantities using LLM
    extracted_items = query_openai_for_ingredients(user_input)

    # Step 2: Match extracted ingredients to inventory
    results = match_products_to_inventory(extracted_items, df)

    # Step 3: Display results for customer support/navigation
    for r in results:
        print(
            f"{r['ingredient']} ({r['quantity']}): {r['name']} | {r['brand']} | "
            f"${r['price']} | Discount: {r['discount']}% | Aisle: {r['aisle']}"
        )