## Requirements:
- Create a list of songs showing “Song Title”, “Thumbnail Image”, “Play/Pause Button”,
and “Like Button”.
- User can play and pause songs in the list
- User should be able to like the songs
### Additional Points:
- Providing tests for the app
- Using animation and transitions to improve the UI
### Endpoints:
### Song List:
- Method: GET
- Endpoint address: https://api-stg.jam-community.com/song/trending
### Like Song:
- Method: POST
- Headers: Content-Type: application/x-www-form-urlencoded
- Query params: apikey=___process.env.REACT_APP_API_KEY
- Body params: id - id of a song to like
- Endpoint address: https://api-stg.jam-community.com/interact/like
