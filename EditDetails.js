/**
 * Created by Alex on 11/9/2017.
 */
import React from 'react'
import {Button, StyleSheet, Text, TextInput, View, AsyncStorage, ToastAndroid} from "react-native";
import {Pie} from 'react-native-pathjs-charts';
import firebase from 'react-native-firebase';


export default class EditDetails extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: `Edit details`,
    });

    constructor(props){
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            newTitle: params.edititm.name,
            newDetails: params.edititm.description,
            newRating: 5
        };

        this.dbRef = firebase.database().ref("traveller");
        this.isNewItem = params.newItem;

        this.data = [[
            [0, 1],
            [1, 3],
            [3, 7],
            [4, 9],
        ]];
    }

    saveItem(item){

        if (this.state.newTitle === '' || this.state.newDetails === ''){
            ToastAndroid.show("Name and description are mandatory!", ToastAndroid.SHORT);
            return;
        }
        let newId = 0;

        if (this.isNewItem)
            newId = this.dbRef.push().key;
        else
            newId = item.id;

        this.dbRef.child(newId).update({
            id: newId,
            name: this.state.newTitle,
            description: this.state.newDetails,
            rating: this.state.newRating,
            photo: "",
            email: firebase.auth().currentUser.email
        });
    }

    render() {

        const {params} = this.props.navigation.state;
        const {navigate} = this.props.navigation;
        const {goBack} = this.props.navigation;

        let data = [
            {
                "name": "Dummy",
                "length": 20
            },
            {
                "name": "Dummier",
                "length": 35
            },
            {
                "name": "Dummest",
                "length": 45
            }
        ];
        let options = {
            margin: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20
            },
            width: 200,
            height: 200,
            color: '#27ae60',
            r: 10,
            R: 100,
            legendPosition: 'topLeft',
            animate: {
                type: 'oneByOne',
                duration: 2,
                fillTransition: 3
            },
            label: {
                fontFamily: 'Arial',
                fontSize: 12,
                fontWeight: true,
                color: '#2c3e50'
            }
        };

        return (
            <View style={styles.mainContainer}>
                <View style={styles.titleInputContainer}>
                    <TextInput style={styles.centeredInputStyle}
                               onChangeText={(text) => this.setState({newTitle: text})}>
                        {params.edititm.name}
                    </TextInput>
                </View>
                <View style={styles.editInputContainer}>
                    <TextInput style = {styles.centeredInputStyle}
                               multiline = {true}
                               onChangeText={(text) => this.setState({newDetails: text})}>
                        {params.edititm.description}
                    </TextInput>
                </View>

                <View style={styles.saveButtonContainer}>
                    <Button onPress={() => {
                        this.saveItem(params.edititm);
                        params.refreshFunc();
                        goBack();
                    }
                    } title="Save changes"/>
                </View>
                {/*<View style={styles.chartContainer}>*/}
                    {/*<Pie*/}
                        {/*data = {data}*/}
                        {/*options = {options}*/}
                        {/*accessorKey = "length"*/}
                    {/*/>*/}
                {/*</View>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#2980b9',
        flex: 1,
    },

    titleInputContainer: {
        width: '90%',
        height: '20%',
        marginLeft: '5%',
        paddingTop: '5%',
    },

    centeredInputStyle: {
        textAlign: 'center',
    },

    editInputContainer: {
        width: '80%',
        height: '20%',
        marginLeft: '10%',
    },

    saveButtonContainer: {
        width: '60%',
        height: '15%',
        paddingTop: '5%',
        marginLeft: '20%',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});