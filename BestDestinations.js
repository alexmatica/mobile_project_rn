/**
 * Created by Alex on 11/9/2017.
 */
import React from 'react'
import {StyleSheet, View, Text, FlatList, Image, RefreshControl, Button, AsyncStorage, Alert, ToastAndroid} from 'react-native'
import TouchableItem from "./node_modules/react-navigation/lib-rn/views/TouchableItem";
import {Destination} from "./Destination";
import firebase from 'react-native-firebase';


export default class BestDestinations extends React.Component{
    static navigationOptions = {
        title: 'Best destinations',
    };

    constructor(props){
        super(props);
        this._onRefresh = this._onRefresh.bind(this);
        this.state = {
            refreshing: false,
            destinations: []
        };
        this.dbRef = firebase.database().ref('traveller');

    }

    listenForItems(_dbRef){
        _dbRef.on('value', (snapshot) => {
            let items = [];
            snapshot.forEach((child) => {
                items.push(child.val());
            });
            this.setState({destinations:items});
        });
    }


    componentDidMount(){
        this._onRefresh();
    }

    _onRefresh() {
        this.setState({refreshing:true});
        this.listenForItems(this.dbRef);
        this.setState({refreshing:false});
    }

    tryAdd(){
        if (firebase.auth().currentUser.isAnonymous){
            ToastAndroid.show("You cannot add a new item!", ToastAndroid.SHORT);
            return;
        }
        const {navigate} = this.props.navigation;
        let d = new Destination('','',0,'');
        navigate('Edit', {edititm: d, refreshFunc:this._onRefresh, newItem:true});

    }

    tryEdit(item){
        if (item.email !== firebase.auth().currentUser.email){
            ToastAndroid.show("You cannot edit this item!", ToastAndroid.SHORT);
            return;
        }
        const {navigate} = this.props.navigation;
        navigate('Edit', {edititm: item, refreshFunc: this._onRefresh, newItem:false})
    }

    tryRemove(item){

        if (item.email !== firebase.auth().currentUser.email){
            ToastAndroid.show("You cannot remove this item!", ToastAndroid.SHORT);
            return;
        }

        Alert.alert(
            'Remove item',
            'Are you sure you want to remove this item?',
            [
                {text: 'I am sure', onPress: () => {
                    this.dbRef.child(item.id).remove();
                    this._onRefresh();
                }},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        );

    }

    render(){
        const {navigate} = this.props.navigation;
        if (this.state.refreshing === true){
            return (
                <View style={styles.container}>
                    <Text>Best destinations are loading...</Text>
                </View>
            );
        } else
            return (
                <View style={styles.container}>
                    <Button title="Add Destination"
                            onPress={() => this.tryAdd()}>
                    </Button>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                        data={this.state.destinations}
                        keyExtractor={(item, index) => index}
                        renderItem={({item}) =>
                            <View style={styles.listItemContainer}>
                                <Image style={styles.itemImage} source={require('./images/globe.png')}/>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                                <TouchableItem style={styles.itemDescription}
                                               onPress={() => this.tryEdit(item)}>
                                    <Text style={styles.itemDescriptionText}>
                                        {item.description}
                                    </Text>
                                </TouchableItem>
                                <Text style={styles.itemRating}>{item.rating}</Text>
                                <TouchableItem
                                    onPress={() => this.tryRemove(item)}>
                                    <Image style = {styles.itemImage} source={require('./images/thumbsup.png')}/>
                                </TouchableItem>
                            </View>
                        }
                    />
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#7f8c8d',
        alignItems: 'center',
        justifyContent: 'center',
    },

    listItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#95a5a6',
        marginTop: 2,
    },

    itemTitle: {
        fontSize: 16,
        height: 30,
        width: '40%',
        color: 'black',
    },

    itemDescription: {
        height: 30,
        width: '30%',
    },

    itemDescriptionText: {
        fontSize: 16,
        color: 'white',
    },

    itemRating: {
        fontSize: 18,
        height: 30,
        width: '5%',
        color: 'black',
    },

    itemImage: {
        height: 40,
        width: 40,
        padding: 3,
    }
});