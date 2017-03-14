// Required modules
const begin = require("./startRequest");
// JSON data for the server
var searchRequestBody =
{
  "size": 1000,
  "sort": [
    {
      "@timestamp": {
        "order": "desc",
        "unmapped_type": "boolean"
      }
    }
  ],
  "query": {
    "bool": {
      "must": [
        {
          "query_string": {
            "analyze_wildcard": true,
            "query": "*"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gte": 1488291109254,
              "lte": 1488292009254,
              "format": "epoch_millis"
            }
          }
        }
      ],
      "must_not": []
    }
  },
  "highlight": {
    "pre_tags": [
      "@kibana-highlighted-field@"
    ],
    "post_tags": [
      "@/kibana-highlighted-field@"
    ],
    "fields": {
      "*": {}
    },
    "require_field_match": false,
    "fragment_size": 2147483647
  },
  "_source": {
    "excludes": []
  },
  "aggs": {
  },
  "stored_fields": [
    "*"
  ],
  "script_fields": {},
  "docvalue_fields": [
    "@timestamp"
  ]
}

begin.beginRequest(searchRequestBody); // Begin the request by sending the JSON body to be altered in the "startRequest" module
