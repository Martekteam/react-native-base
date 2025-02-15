import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {Controller, useFormContext} from 'react-hook-form';

const FormInput = props => {
  const {control} = useFormContext();

  return (
    <>
      <Controller
        control={control}
        defaultValue={props.defaultValues ? props.defaultValues : ''}
        render={({field: {onChange, value, onBlur}}) => (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.inputContainer}>
                <View style={styles.iconStyle}>
                  <AntDesign name={props.iconType} size={25} color="#666" />
                </View>
                <Inputs
                  {...props}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                {props.textName === 'Password' ||
                props.textName === 'ConfirmPassword' ? (
                  <TouchableOpacity
                    style={{justifyContent: 'flex-end', padding: 15}}
                    onPress={props.showHidePassword}>
                    <Text style={{fontSize: 12}}>
                      {props.showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {props.errorobj &&
              props.errorobj.hasOwnProperty(props.textName) &&
              props.errorobj[props.textName] != '' && (
                <Text
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                    color: '#D83F50',
                  }}>
                  {props.errorobj[props.textName].message}
                </Text>
              )}
            {props.validationError &&
              props.validationError.hasOwnProperty(props.textName) &&
              props.validationError[props.textName] != '' && (
                <Text
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                    color: '#D83F50',
                  }}>
                  {props.validationError[props.textName]}
                </Text>
              )}
          </View>
        )}
        name={props.textName}
        rules={props.ruleses}
        // error={isError}
        // helperText={errorMessage}
      />
    </>
  );
};

const Inputs = props => {
  const removeErrorMessage = () => {
    props.validationError && props.validationError[props.textName]
      ? (props.validationError[props.textName] = '')
      : null;
  };

  switch (props.textName) {
    case 'PhoneNumber':
      return props.disableField === true ? (
        <Text
          style={{
            paddingTop: 10,
            color: '#B3B3B3',
            fontSize: 14,
            fontFamily: 'Lato-Regular',
          }}>
          {props.value ? props.value : ''}
        </Text>
      ) : (
        <TextInput
          selectionColor={'#f17316'}
          autoFocus={props.autoFocus}
          style={props.style ? props.style : [styles.cardinput]}
          onBlur={props.onBlur}
          onChangeText={value => {
            props.onChange(
              value
                .replace(/[^0-9]/g, '') // To allow only numbers
                .trim(),
            );
            removeErrorMessage();
          }}
          value={props.value}
          placeholder={props.placeHolder}
          keyboardType={props.keyboardType}
          secureTextEntry={props.pwdVisible}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={props.refField}
          ref={props.refs}
          editable={props.editable}
          maxLength={10}
        />
      );
    default:
      return (
        <TextInput
          selectionColor={'#CD9BF0'}
          autoFocus={props.autoFocus}
          style={props.style ? props.style : [styles.input]}
          onBlur={props.onBlur}
          onChangeText={value => {
            props.onChange(value);
            removeErrorMessage();
            props.onTextChange ? props.onTextChange(value) : null;
          }}
          value={props.value}
          placeholder={props.placeHolder}
          keyboardType={props.keyboardType}
          secureTextEntry={props.pwdVisible}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={props.refField}
          ref={props.refs}
          editable={props.editable}
        />
      );
  }
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 13,
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
