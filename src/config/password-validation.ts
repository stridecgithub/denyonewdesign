import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('newpassword').value; // to get value in input tag
       let confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('confirmpassword').setErrors( {MatchPassword: true} )
            AC.get('newpassword').setErrors( {MatchPassword: true} )
        } else {
            return null
        }
    }
}