import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 4,
      },
      input: {
        height: 40,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '6e0505',
      },
      listContainer: {
        marginTop: 20,
        width: '100%',
      },
      listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      propertyItemContainer: {
        alignItems: 'flex-start',
        borderBottomColor: '#6e6b6b',
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginBottom: 10,
      },
      propertyItem: {
        fontSize: 16,
        marginBottom: 8,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 8,
      },
      editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
    });