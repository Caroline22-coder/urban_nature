import os
import requests
import csv
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()
API_KEY = os.getenv("PLANTNET_API_KEY")
PROJECT = "all"
API_ENDPOINT = f"https://my-api.plantnet.org/v2/identify/{PROJECT}?api-key={API_KEY}"

CSV_FILENAME = "plantnet_results.csv"

def analyze_image(image_path):
    # Open the image file
    with open(image_path, "rb") as image_file:
        files = {"images": ("image.jpg", image_file, "image/jpeg")}
        try:
            response = requests.post(API_ENDPOINT, files=files)
            if response.ok:
                results = response.json().get("results", [])
                if results:
                    species = results[0].get("species", {})
                    common_names = ", ".join(species.get("commonNames", [])) or "N/A"
                    scientific_name = species.get("scientificNameWithoutAuthor", "N/A")
                    score = round(results[0].get("score", 0), 4)
                    family = species.get("family", {}).get("scientificName", "N/A")
                    genus = species.get("genus", {}).get("scientificName", "N/A")

                    print(f"Common name: {common_names}")
                    print(f"Scientific name: {scientific_name}")
                    print(f"Family: {family}")
                    print(f"Genus: {genus}")
                    print(f"Score: {score}")

                    return {
                        "common_name": common_names,
                        "scientific_name": scientific_name,
                        "family": family,
                        "genus": genus,
                        "score": score,
                    }
                else:
                    print("No results found.")
                    return None
            else:
                print("Error:", response.status_code, response.text)
                return None
        except Exception as e:
            print("Request failed:", e)
            return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    analyze_image(image_path)