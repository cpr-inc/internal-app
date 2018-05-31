export class User {

    uid: string;
    email: string;
    displayName?: string;
    firstname?: string;
    lastname?: string;
    No?: number;
    department?: string;
    isEdit?: boolean;
    // isTrash?: boolean;
    themecolor?: string;
    logindate?: string;
    islogin?: boolean
    position?: string;
    other?: string;
    password?: string

    constructor(user) {
        this.uid = user.uid ? user.uid : "";
        this.email = user.email ? user.email : "";
        // this.firstname = user.firstname;
        // this.lastname = user.lastname;
        this.islogin = user.islogin ? user.islogin : false;
        
        if(user.password){
            this.password = user.password;
        }else{
            this.password = null;
        }
        if(user.No){
            this.No = user.No;
        }else{
            this.No = null;
        }

        if(user.displayName){
            this.displayName = user.displayName;
        }else{
            this.displayName = "";
        }

        if(user.department){
            this.department = user.department;
        }else{
            this.department = "";
        }
        if(!user.isEdit){
            this.isEdit = false;
        }else{
            this.isEdit = user.isEdit;
        }
        // if(!user.isTrash){
        //     this.isTrash = false;
        // }else{
        //     this.isTrash = user.isTrash;
        // }
        if(user.themecolor){
            this.themecolor = user.themecolor;
        }else{
            this.themecolor = "";
        }
        if(user.logindate){
            this.logindate = user.logindate;
        }else{
            this.logindate = "";
        }
        if(user.position){
            this.position = user.position;
        }else{
            this.position = "";
        }    
        if(user.other){
            this.other = user.other;
        }else{
            this.other = "";
        }    
    }
}  