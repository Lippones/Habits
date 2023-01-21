import { View, StyleSheet, ActivityIndicator } from "react-native";

export function Loading() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator color="#7C3AED"></ActivityIndicator>
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09090A'
    }
})