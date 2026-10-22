package main

import (
	"log"
	"net/http"
	"os"
)


func main() {
	handler := &sshHandler{addr: os.Getenv("SSH_TARGET"), keyfile: "/root/id_ed25519"}

	http.Handle("/", http.FileServer(http.Dir("./front/")))
	http.HandleFunc("/ssh", handler.webSocket)
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}
