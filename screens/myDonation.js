import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";

import db from "../config";
import firebase from "firebase";

export default class MyDonationScreen extends Component {
  constructor() {
    super();
    this.state = {
      user_id: firebase.auth().currentUser.email,
      allDonations: [],
    };
    this.requestRef = null;
  }

  getAllDonations = () => {
    this.requestRef = db
      .collection("Donations")
      .where("donor_id", "==", this.state.user_id)
      .get()
      .onSnapshot(snapshot => {
        var allData = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allDonations: allData,
        });
      });
  };
  keyExtractor = (item, index) => index.toString()
  renderItem = (item,i) => (<ListItem>
    key = {i},
    title = {item.book_name},
    subtitle = {'Requested By: ' + item.requestBy + "status: " + item.request_status}
    leftElement = {<Icon name = 'book' type = 'fontAwesome' color = "blue"/>
     }
      titleStyle = {{color: '#000000', fontWeight: 'bold'} }
      rightElement = {<TouchableOpacity>
          <Text>Send Book</Text>
          </TouchableOpacity>}
          bottomDivider
  </ListItem>)

        componentDidMount() {
            this.getAllDonations();
        }

  render() {
    return (
        <View>
            {(this.state.allDonations.length === 0 ) ? (
                <View>
                    <Text>List of all Book Donations</Text>
                </View>
            ) : (
                <View><FlatList keyExtractor = {this.keyExtractor}
                data = {this.state.allDonations}
                renderItem = {this.state.renderItem}></FlatList></View>
            )}
        </View>
    )
  }
}
