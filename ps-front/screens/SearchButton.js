import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../colors';

const SearchButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.searchButton} onPress={onPress}>
            <Text style={styles.searchButtonText}><Icon name='search' size={32} color={'#FFFFFF'} /></Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    searchButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 54,
        height: 54,
        // zIndex: 100,
        backgroundColor: colors.darkViolet,
        borderRadius: 32,
        // borderWidth: 1,
        // borderColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SearchButton;