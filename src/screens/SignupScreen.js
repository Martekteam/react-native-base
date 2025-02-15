import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
//import SocialButton from '../components/SocialButton';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {saveMemberDetails} from '../redux/actions/AuthState';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {registerSchema} from '../utils/ValidateSchema';
import {isEmpty} from 'lodash';
import {firebaseAuthErrors} from '../utils/Handlers';
import {Loader} from '../components/Loader';

const SignupScreen = ({navigation}) => {
  const [inputUser, setInputUser] = useState({
    FirstName: '',
    Surname: '',
    PhoneNumber: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
  });
  const [loader, setLoader] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(true);
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  const methods = useForm({
    mode: 'onBlur',
    resolver: yupResolver(registerSchema),
  });
  const {
    handleSubmit,
    formState: {errors},
  } = methods;

  const FirstNameRef = useRef(null);
  const SurnameRef = useRef(null);
  const PhoneNumberRef = useRef(null);
  const EmailRef = useRef(null);
  const PasswordRef = useRef(null);
  const ConfirmPasswordRef = useRef(null);

  const dispatch = useDispatch();

  const onRegisterSubmit = async user => {
    try {
      setRegisterError(null);
      setLoader(true);
      const formData = {
        FirstName: user.FirstName,
        Surname: user.Surname,
        PhoneNumber: user.PhoneNumber,
        Email: user.Email,
        Password: user.Password,
        ConfirmPassword: user.ConfirmPassword,
      };
      setInputUser(() => formData);
      await auth()
        .createUserWithEmailAndPassword(user.Email, user.Password)
        .then(authResponse => {
          if (authResponse.user) {
            setInputUser({
              ...inputUser,
              FirstName: user.FirstName,
              Surname: user.Surname,
              PhoneNumber: user.PhoneNumber,
              Email: user.Email,
              Password: user.Password,
              ConfirmPassword: user.ConfirmPassword,
            });
            // firestore()
            //   .collection('users')
            //   .doc(auth().currentUser.uid)
            //   .set({
            //     fname: user.FirstName,
            //     lname: user.Surname,
            //     email: email,
            //     createdAt: firestore.Timestamp.fromDate(new Date()),
            //     userImg: null,
            //   })
            //   //ensure we catch any errors at this stage to advise us if something does go wrong
            //   .catch(error => {
            //     console.log(
            //       'Something went wrong with added user to firestore: ',
            //       error,
            //     );
            //     setLoader(false);
            //   });
            dispatch(saveMemberDetails(authResponse.user));
            setLoader(false);
          }
        })
        //we need to catch the whole sign up process if it fails too.
        .catch(error => {
          setRegisterError(null);
          const response = firebaseAuthErrors(error);
          setFirebaseError(response);
          setLoader(false);
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <FormProvider {...methods}>
          <FormInput
            iconType="edit"
            autoFocus={true}
            defaultValues={inputUser.FirstName}
            textLabel={'First Name'}
            placeHolder={'First Name'}
            textName={'FirstName'}
            keyboardType="default"
            errorobj={errors}
            validationError={registerError}
            refs={FirstNameRef}
            refField={() => SurnameRef.current.focus()}
          />

          <FormInput
            iconType="edit"
            defaultValues={inputUser.Surname}
            textLabel={'Controller id'}
            placeHolder={'Controller id'}
            textName={'Controller id'}
            keyboardType="default"
            errorobj={errors}
            validationError={registerError}
            refs={SurnameRef}
            refField={() => PhoneNumberRef.current.focus()}
          />

          <FormInput
            iconType="phone"
            defaultValues={inputUser.PhoneNumber}
            textLabel={'Phone Number'}
            placeHolder={'Phone Number'}
            textName={'PhoneNumber'}
            keyboardType="numeric"
            errorobj={errors}
            validationError={registerError}
            refs={PhoneNumberRef}
            refField={() => EmailRef.current.focus()}
          />

          <FormInput
            iconType="user"
            defaultValues={inputUser.Email}
            textLabel={'Email'}
            placeHolder={'Email'}
            textName={'Email'}
            keyboardType="email-address"
            errorobj={errors}
            validationError={registerError}
            refs={EmailRef}
            refField={() => PasswordRef.current.focus()}
          />

          <FormInput
            iconType="lock"
            defaultValues={inputUser.Password}
            textLabel={'Password'}
            placeHolder={'Password'}
            textName={'Password'}
            keyboardType="default"
            errorobj={errors}
            validationError={registerError}
            showHidePassword={() => {
              setPwdVisible(!pwdVisible);
              setShowPassword(!showPassword);
            }}
            showPassword={showPassword}
            pwdVisible={pwdVisible}
            refs={PasswordRef}
            refField={() => ConfirmPasswordRef.current.focus()}
          />

          <FormInput
            iconType="lock"
            defaultValues={inputUser.ConfirmPassword}
            textLabel={'ConfirmPassword'}
            placeHolder={'ConfirmPassword'}
            textName={'ConfirmPassword'}
            keyboardType="default"
            errorobj={errors}
            validationError={registerError}
            showHidePassword={() => {
              setConfirmPwdVisible(!confirmPwdVisible);
              setConfirmShowPassword(!confirmShowPassword);
            }}
            showPassword={confirmShowPassword}
            pwdVisible={confirmPwdVisible}
            refs={ConfirmPasswordRef}
          />
        </FormProvider>

        {!isEmpty(firebaseError) ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              fontSize: 16,
              textAlign: 'center',
              fontFamily: 'Lato-Regular',
              color: '#D83F50',
            }}>
            {firebaseError}
          </Text>
        ) : null}

        {!isEmpty(registerError) ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              fontSize: 16,
              textAlign: 'center',
              fontFamily: 'Lato-Regular',
              color: '#D83F50',
            }}>
            {registerError}
          </Text>
        ) : null}

        <FormButton
          buttonTitle="Sign Up"
          onPress={handleSubmit(onRegisterSubmit)}
        />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            By registering, you confirm that you accept our{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              Terms of service
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> and </Text>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Privacy Policy
          </Text>
        </View>

        {/* {Platform.OS === 'android' ? (
          <View>
            <SocialButton
              buttonTitle="Sign Up with Facebook"
              btnType="facebook"
              color="#4867aa"
              backgroundColor="#e6eaf4"
              onPress={() => {}}
            />

            <SocialButton
              buttonTitle="Sign Up with Google"
              btnType="google"
              color="#de4d41"
              backgroundColor="#f5e7ea"
              onPress={() => {}}
            />
          </View>
        ) : null} */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loader ? <Loader /> : null}
      <Text style={styles.text}>Create an account</Text>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <FlatList
          style={{width: '100%'}}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          data={[{ID: '1'}]}
          keyExtractor={item => `${item.ID}`}
          renderItem={renderItem}
        />
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
