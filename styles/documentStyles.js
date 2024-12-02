import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f4f8',
        padding: 20,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      projectItem: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        marginVertical: 5,
        marginHorizontal: 10,
      },
      selectedProject: {
        backgroundColor: '#4CAF50',
      },
      projectText: {
        fontSize: 16,
        color: '#333',
      },
      selectedProjectText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      uploadButton: {
        marginVertical: 20,
      },
      documentItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginBottom: 10,
      },
      fileName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      removeButton: {
        color: 'red',
        marginTop: 5,
        fontWeight: 'bold',
      },
      downloadButton: {
        color: 'blue',
        marginTop: 5,
        fontWeight: 'bold',
      },
      uploadDocumentsButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      },
      uploadDocumentsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
    });