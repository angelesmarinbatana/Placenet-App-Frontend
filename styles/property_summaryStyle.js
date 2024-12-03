import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
      },
      logo: {
        width: 200,
        height: 110,
        marginBottom: 20,
      },
      titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
      },
      listContainer: {
        paddingBottom: 20,
      },
      propertyContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        width: '100%',
        borderColor: '#E0E0E0',
        borderWidth: 1,
      },
      propertyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#404040',
        marginBottom: 10,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 10,
        marginBottom: 5,
      },
      itemText: {
        fontSize: 14,
        color: '#404040',
        marginBottom: 3,
      },
      errorText: {
        color: 'red',
        marginBottom: 10,
      },
    });