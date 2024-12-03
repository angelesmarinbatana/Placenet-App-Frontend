import { StyleSheet } from 'react-native';

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
      input: {
        backgroundColor: '#F0F0F0',
        borderColor: '#C0C0C0',
        borderRadius: 5,
        height: 50,
        width: '80%',
        margin: 12,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
      },
      errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
      },
      button: {
        backgroundColor: '#404040ff',
        borderRadius: 5,
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
      },
      signinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      },
      signinText: {
        color: '#A9A9A9',
        fontSize: 14,
      },
      signinLink: {
        color: '#0000FF',
        fontSize: 14,
        marginLeft: 5,
        textDecorationLine: 'underline',
      },
});