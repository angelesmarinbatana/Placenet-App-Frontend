import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
      },
      propertyItem: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        marginVertical: 5,
      },
      selectedProperty: {
        backgroundColor: '#4CAF50',
      },
      propertyText: {
        fontSize: 16,
        color: '#333',
      },
      selectedPropertyName: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 10,
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      datePickerButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginBottom: 10,
      },
      datePickerText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
      },
      projectListContainer: {
        marginTop: 20,
      },
      projectItem: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
      },
      projectText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f3857',
      },
      projectDescription: {
        fontSize: 14,
        color: '#0f3857',
        marginVertical: 5,
      },
      label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 4,
        color: '080707',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
    });