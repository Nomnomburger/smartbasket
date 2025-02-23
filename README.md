# SmartBasket

Hack Canada project - Winston Zhao

SmartBasket is a web based shopping list designed to help solve one of the largest issues in Canada: the rising cost of living. 
- compares prices of nearby retailers and picks out the lowest prices
- operates a custom crowdsourced deals/sales network for goods in stores
- suggests cheaper alternatives if available
- groups shopping list items by store
- takes into account travel time and transportation when suggesting purchase locations (gas, transit money)

## How to set up and run project

npm install

create a .env and create and insert the following access keys:

Firebase:
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

Gemini:
NEXT_PUBLIC_GEMINI_API_KEY
GEMINI_API_KEY

SerpApi:
NEXT_PUBLIC_SERPAPI_KEY
SERPAPI_KEY

GCP Google Maps API:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
GOOGLE_MAPS_API_KEY

Open Weather Map:
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY

npm run dev
