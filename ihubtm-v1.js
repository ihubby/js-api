"use strict";
(function() {
    const SMS_API = {
        _APIKey: '',
        initWithKey: function() {
            let params = this.extractParamsFromGET();
            this._APIKey = params.key || '';
        },
        extractParamsFromGET: function() {
            // Extractor idea by James Smith (https://loopj.com)

            let script_name = 'ihubtm-v1.js';
            // Find all script tags
            let scripts = document.getElementsByTagName("script");

            // Look through them trying to find ourselves
            for(let i=0; i<scripts.length; i++) {

                if(scripts[i].src.indexOf("/" + script_name) > -1) {
                    // Get an array of key=value strings of params
                    let pa = scripts[i].src.split("?").pop().split("&");

                    // Split each key=value into array, the construct js object
                    let p = {};
                    for(let j=0; j<pa.length; j++) {
                        let kv = pa[j].split("=");
                        p[kv[0]] = kv[1];
                    }
                    return p;
                }
            }

            // No scripts match
            return {};
        },
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
            let formData = new FormData();
            for ( let key in data ) {
                if(data.hasOwnProperty(key)) formData.append(key, data[key]);
            }
            formData.append('key', this._APIKey);

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
    window['SMS_API'] = SMS_API;
    SMS_API.initWithKey();
})();