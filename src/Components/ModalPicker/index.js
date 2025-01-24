import React, {useState} from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'

const dayitems = ['01', '02', '03', '04', '05', '06', '07',
                 '08', '09', '10', '11', '12', '13', 
                 '14', '15', '16', '17', '18', '19',
                 '20', '21', '22', '23', '24','25', 
                 '26', '27', '28', '29', '30', '31']

const monthitems = ['01', '02', '03', '04', '05',
                    '06', '07', '08', '09', '10', 
                    '11', '12']

const yearitems = [
                '1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973',
                '1974','1975','1976','1977','1978','1979','1980','1981','1982','1983','1984','1985','1986',
                '1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999',
                '2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012',
                '2013','2014','2015','2016','2017','2018','2019','2020','2021']
                
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


const CustomPicker = (props) => {
    // console.log({type});

        // if(type == 'day')
        // {
        //     SomeData = dayitems;
        // }
        // else if(type == 'month')
        // {
        //     SomeData = monthitems;
        // }
        // else if(type == 'year')
        // {
        //     SomeData = yearitems;
        // }



    const onPresItem = (option) =>{
            props.changeModalVisibility(false);
            props.setDataDay(option);
    }
    const option = dayitems.map((item, index) =>{
        return(
            <TouchableOpacity
            style = {styles.option}
            key={index}
            onPress= {() => onPresItem(item)}>
                
                <Text style = {styles.text}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
    })
    return (
        <TouchableOpacity
        onPress ={() => props.changeModalVisibility(false)}
        style= {styles.constainer}
        >
            <View style = {[styles.modal, {width: WIDTH -300 , height: HEIGHT/2}]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    ) 


}

const MonthPicker = (props) => {

    const onPresItem = (option) =>{
            props.changeModalVisibility(false);
            props.setDataMonth(option);
    }
    const option = monthitems.map((item, index) =>{
        return(
            <TouchableOpacity
            style = {styles.option}
            key={index}
            onPress= {() => onPresItem(item)}>
                
                <Text style = {styles.text}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
    })
    return (
        <TouchableOpacity
        onPress ={() => props.changeModalVisibility(false)}
        style= {styles.constainer}
        >
            <View style = {[styles.modal, {width: WIDTH -300 , height: HEIGHT/2}]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )


}


const YearPicker = (props) => {

    const onPresItem = (option) =>{
            props.changeModalVisibility(false);
            props.setData(option);
    }
    const option = yearitems.map((item, index) =>{
        return(
            <TouchableOpacity
            style = {styles.option}
            key={index}
            onPress= {() => onPresItem(item)}>
                
                <Text style = {styles.text}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
    })
    return (
        <TouchableOpacity
        onPress ={() => props.changeModalVisibility(false)}
        style= {styles.constainer}
        >
            <View style = {[styles.modal, {width: WIDTH -300 , height: HEIGHT/2}]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )


}

const styles = StyleSheet.create({
    constainer: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    modal: {
        backgroundColor: "white",
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 1
    },
    option: {
        alignItems: 'flex-start'
    },
    text: {
        margin : 10, 
        fontSize: 17, 
        fontFamily: 'Roboto',
    }
})

export {CustomPicker, MonthPicker, YearPicker}