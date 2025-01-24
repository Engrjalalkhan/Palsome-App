import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useFormik } from "formik";
import { StyleSheet } from "react-native";

const CountryCityPicker = () => {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  //   const countries = csc.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country,
  }));

  const updatedStates = (countryId) =>
    csc
      .getStatesOfCountry(countryId)
      .map((state) => ({ label: state.name, value: state.id, ...state }));

  const updatedCities = (stateId) =>
    csc
      .getCitiesOfState(stateId)
      .map((city) => ({ label: city.name, value: city.id, ...city }));

  const handleSubmit = () => {
    const values = { country, state, city };
    console.log(JSON.stringify(values));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* You need to replace Select with a suitable React Native component for dropdowns. */}
      {/* Also, replace the button with TouchableOpacity or another suitable touchable component. */}
      {/* For this example, I'm using Text for display purposes. */}
      <Text>Country:</Text>
      {/* Replace Select with a suitable dropdown component */}
      <Text>{country}</Text>

      <Text>State:</Text>
      {/* Replace Select with a suitable dropdown component */}
      <Text>{state ? state.label : "Select a state"}</Text>

      <Text>City:</Text>
      {/* Replace Select with a suitable dropdown component */}
      <Text>{city ? city.label : "Select a city"}</Text>

      <Button title="Submit" onPress={handleSubmit} />

      <Text>{JSON.stringify(csc.get)}</Text>
    </View>
  );
};

export default CountryCityPicker;

const styles = StyleSheet.create({});
