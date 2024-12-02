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
        marginBottom: 30,
        textAlign: 'center',
      },
      button: {
        backgroundColor: '#404040ff',
        borderRadius: 5,
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
      },
      buttonOutline: {
        borderColor: '#404040ff',
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      },
      buttonOutlineText: {
        color: '#404040ff',
        fontSize: 18,
        textAlign: 'center',
      },
});