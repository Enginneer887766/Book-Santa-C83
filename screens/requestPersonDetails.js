import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Card } from "react-native-elements";

class RequestPersonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: firebase.auth().currentUser.email,
      reciever_id: this.props.navigation.getParam("details")["user_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reasonToRequest: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      request_id: this.props.navigation.getParam("details")["request_id"],
      recieveerName: "",
      
      recieveerContact: "",
      recieveerAddress: "",
      reciever_request_id: "",
    };
  }

  GetRequestPersonDetails = () => {
    db.collection("Users")
      .where("email_id", "==", this.state.reciever_id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            recieveerName: doc.data().first_name,
            recieveerAddress: doc.data().address,
            recieveerContact: doc.data().contact,
          });
        });
      });

    db.collection("requested_books")
      .where("request_id", "==", this.state.request_id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            reciever_request_id: doc.id,
          });
        });
      });
  };
  componentDidMount() {
    this.GetRequestPersonDetails();
  }

  updateBookStatus = () => {
    db.collection("Donations").add({
      book_name: this.state.bookName,
      reciever_name: this.state.recieveerName,
      donor_id: this.state.user_id,
      request_status: "interested",
      request_id: this.state.request_id,
      requestBy: this.state.recieveerName,
    });
  };

  render() {
    return (
      <View style = {{flex: 1}}>
        <View style={{ flex: 0.3 }}>
          <Card title={"Book Information"} titleStyle={{ fontStyle: 13 }} style = {styles.card}>
            <Card style = {styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                Book Name: {this.state.bookName}
              </Text>
            </Card>
            <Card style = {styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                Reason To Request: {this.state.reasonToRequest}{" "}
              </Text>
            </Card>
          </Card >
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Reciever Information"} style = {styles.card}>
            <Card style = {styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                Reciever Name: {this.state.recieveerName}{" "}
              </Text>
            </Card>
            <Card style = {styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                Reciever Contact: {this.state.recieveerContact}{" "}
              </Text>
            </Card>
            <Card style = {styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                Reciever Address: {this.state.recieveerAddress}{" "}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
         {( this.state.reciever_id !== this.state.userId? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateBookStatus();
                this.props.navigation.navigate("MyDonationScreen");
              }}
            >
              <Text>I want to Donate</Text>
            </TouchableOpacity>
          ) : null)}
        </View>
      </View>
    );
  }
}

export default RequestPersonDetails;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
    
  },
  card: {
      margin:20
  }
});
