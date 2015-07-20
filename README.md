#Opendoor Challenge
##To run
    npm install
##Notes
A few things that could be added:

* Set up production vs development environments with test data

* Travis CI setup for faster development

* Nicer front-end with a button to make GET requests (nice to have)

* Pretty print geoJSON (cosmetic)

* More rigorous validation of parameters

> For example: if min > max, immediately return empty geoJSON set instead of filtering

* Cron job or periodic retrieval of updated data from S3 file storage

> Timer can be adjusted depending on how often data changes

* Optional : Reorganization of the database for geoindexing (mongo has inbuilt functionality)

* Cache queries- LRU would work

* Testing suite for the backend