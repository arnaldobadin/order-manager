/*
	most of these functions was made by me (long ago)
	using external references and some of them are minified
	and i'm not proud of it
*/

const Tool = function() {}

Tool.REGEXES = {
    PHONE : /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/gi,
    EMAIL : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi
}

Tool.validateCpf = function(value) {
    value = value.replace(/[^\d]+/g, "");
    var sum; var remainder; sum = 0;
    if (value == "00000000000") return false;
    if (value.length != 11) return false;
    for (i = 1; i <= 9; i++) sum = sum + parseInt(value.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder == 10) || (remainder == 11)) remainder = 0;
    if (remainder != parseInt(value.substring(9, 10))) return false; sum = 0;
    for (i = 1; i <= 10; i++) sum = sum + parseInt(value.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder == 10) || (remainder == 11)) remainder = 0;
    if (remainder != parseInt(value.substring(10, 11))) return false;
    return true;
}

Tool.validateCnpj = function(value) {
    value = value.replace(/[^\d]+/g, "");
    if (value == "") return false;
    if (value.length != 14) return false;
    if (value == "00000000000000" || value == "11111111111111" || value == "22222222222222" ||
    value == "33333333333333" || value == "44444444444444" || value == "55555555555555" ||
    value == "66666666666666" || value == "77777777777777" || value == "88888888888888" ||
    value == "99999999999999") return false;
    _size_ = value.length - 2; nums = value.substring(0, _size_); digits = value.substring(_size_); sum = 0; pos = _size_ - 7;
    for (i = _size_; i >= 1; i--) {sum += nums.charAt(_size_ - i) * pos--; if (pos < 2) pos = 9;}
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(0)) return false;
    _size_ = _size_ + 1; nums = value.substring(0, _size_); sum = 0; pos = _size_ - 7;
    for (i = _size_; i >= 1; i--) {sum += nums.charAt(_size_ - i) * pos--; if (pos < 2) pos = 9;}
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(1)) return false;
    return true;
}

Tool.checkPid = function(value) {
	return (Tool.validateCpf(value) || Tool.validateCnpj(value));
}

Tool.validatePhone = function(value) {
    return Tool.REGEXES.PHONE.test(value);
}

Tool.validateEmail = function(value) {
    return Tool.REGEXES.EMAIL.test(value);
}

Tool.checkContact = function(value) {
    return (Tool.validatePhone(value) || Tool.validateEmail(value));
}

module.exports = Tool;