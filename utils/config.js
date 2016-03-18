var Config = {
  mongo:{
    misdb:{
      host     : '127.0.0.1',
      port     : '27017',
      dbname   : 'misdb',
      username : 'root',
      passwd   : 'root'
    },
    misdbOnline: {
      host: 'misdb-xuyalin562.tenxcloud.net',
      port: '50022',
      dbname:'misdb',
      username:'admin',
      passwd:''
    }
  },
  qiniu: {
  	access : 'NnQ-dh4_Vc5azn-dayT3-Eo3yrFaRseC1CDnMLvF',
  	secret : 'ysDjIIvmNOLAArQiRQQARhQX_hAaL8vAroXR6kGS',
  	bucket : 'mis-xuyalin'
  }
};
module.exports = Config;
