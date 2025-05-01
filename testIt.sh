#!/usr/bin/bash

ingq="${1:-./jqg.gql.json}"
function e(){
	echo "$1" 1>&2
	exit 255
}
which curl &> /dev/null || e "Please install 'curl' from repositories to be able to send the request"
which jq &> /dev/null || e "Please install 'jq' command from repositories to pretty print output JSON"
[ -f "$ingq" ] || e "ERROR: File ${ingq} does not exist (Are you in the project directory?) (Or specify path to GraphQL in JSON format '{\"query\": [GraphQL code]}' file as first argument)"
echo "Sending GraphQL request"
 curl -X POST -H 'Content-Type: application/json' -d "$(<"$ingq")" http://localhost:8888/graphql | jq
