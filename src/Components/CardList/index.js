import * as React from "react";
import { memo } from "react";
import { View, FlatList, ScrollView } from "react-native";
import CardView from "../CardView";

const CardList = memo((props) => {
  return (
    <FlatList
      refreshing={props.refreshing}
      onRefresh={props.onRefresh}
      showsVerticalScrollIndicator={false}
      data={props.results}
      keyExtractor={(result) => result.id}
      renderItem={({ item }) => {
        return (
          <View style={{ flex: 1 }}>
            <CardView
              result={item}
              mode={props.mode}
              onPressDelete={(id) => props.onPressDelete(id)}
              onPressUpdate={(res) => props.onPressUpdate(res)}
            />
          </View>
        );
      }}
    />
  );
});

export default CardList;
