
var SMS_API = {
    checkPhone: function (phone, success, fail) {
        fail = fail || function () {};

        this._request('check-phone', {
            phone: phone
        }, success, fail);
    },
    checkPhoneCode: function (phone, code, success, fail) {
        fail = fail || function () {};

        this._request('check-phone-answer', {
            phone: phone,
            code: code
        }, success, fail);
    },
    checkStatus: function(success, fail, id){
        id = id || this._lastId;

        this._request('check-status', {
            id: id,
        }, success, fail);
    },

    _lastId: '',
    _request: function (endpoint, data, success, fail) {
        var formData = new FormData();
        for ( var key in data ) {
            formData.append(key, data[key]);
        }

        fetch('https://sms.ihub.by/api/v1/' + endpoint, {
            method: 'POST',
            body: formData,
            mode: 'cors',

        }).then(function (resp) {
            resp.json().then(function (data) {
                if(! data.status){
                    fail(500, data);
                } else {
                    if(data.status === 'ERROR'){
                        fail(parseInt(data.code), data.error);
                    } else {
                        if(data.data && data.data.id){
                            SMS_API._lastId = data.data.id;
                        }
                        success(data.data);
                    }
                }
            });
        }).catch(function(error) {
            fail(0, error.message);
        });
    }
};
