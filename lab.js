

var counterModule = (function() {
    var result = 0;
    return  {
        add:function(x,y){
           return x + y;
        },

        sub:function(x,y){
           return x - y;
        },
        getReult : function(){
            return result;
        }
    }
   
})();

counterModule.add(2,3);
console.log(counterModule.getReult())



class Error {
    constructor(message) {
        this.message = message
        this.name = 'Error';
        
    }
}


class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function test() {
 throw new ValidationError('whoops')
}

try {
    test();
} catch(err) {
   console.log(err.name);
   console.log(err.message);
   console.log(err.stack);
}





// pagination
// sorting order,
// searching,
// filtering,
// eror handling centralize
// refresh token 
// scheduling feature
// swagger api implementeation
// csv and pdf file imports 

