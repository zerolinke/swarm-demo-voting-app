package main

import (
	"gopkg.in/redis.v3"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"os"
	"fmt"
	"encoding/json"
)

var redisclient *redis.Client
var mongoclient *mgo.Session

func init() {

	fmt.Println("init...")

	rh := os.Getenv("redishost")
	if rh == "" {
		rh = "121.201.18.33:6379"
	}
	redisclient = newReidClient(rh)

	mh := os.Getenv("mongohost")
	if mh == "" {
		mh = "mongodb://121.201.18.33:27017"
	}
	mongoclient = newMongoClient(mh)

	fmt.Println("init done")

}

func newReidClient(rh string) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Addr:     rh, //"localhost:6379",
		Password: "", // no password set
		DB:       0, // use default DB
	})

	pong, err := client.Ping().Result()
	fmt.Println(pong, err)
	return client
}

func newMongoClient(mh string) *mgo.Session {
	session, err := mgo.Dial(mh)
	if err != nil {
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	return session
}

func main() {
	
	fmt.Println("main...")

	collection := mongoclient.DB("voting").C("vote")

	for true {
		pop := redisclient.BLPop(0, "votes")
		var vote map[string]interface{}
		json.Unmarshal([]byt

		fmt.Println(pop)

		vid := vote["voter_id"]
		collection.UpsertId(bson.M{"voter_id":vid}, &vote)
	}
}
