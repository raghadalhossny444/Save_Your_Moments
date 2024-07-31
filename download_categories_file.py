import requests

def download_categories_file():
    url = "https://raw.githubusercontent.com/csailvision/places365/master/categories_places365.txt"
    response = requests.get(url)
    with open("Backend/categories_places365.txt", "w") as file:
        file.write(response.text)
    print("Categories file downloaded successfully.")

# Call the function to download the file
download_categories_file()

