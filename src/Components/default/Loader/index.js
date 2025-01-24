import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../../Constants/Colors';

const Loader = ({ loading }) => {

    return (
        <View>
            {loading && (
                <ActivityIndicator size="large" color={COLORS.primary} />
            )}
        </View>
    );
};

export default Loader;
