let  lang=document.getElementById("langOpt");
let line = document.getElementById("lines");
let textArea = document.getElementById("textArea");
let outputB = document.getElementById("output-box");
let button = document.getElementById("compiler-button");

let lines=1;
for(lines;lines<15;lines++){
    line.innerHTML+="<br/>"+ (lines+1)
}

textArea.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        let text = textArea.value;
        let count = text.split(/\r*\n/).length +1;
        if(count>lines)
            line.innerHTML+="<br/>"+(++lines);
        console.log(count);
    }
    else if(event.key == "Tab"){
        event.preventDefault();
        var s = this.selectionStart;
        var e = this.selectionEnd;
        this.value = this.value.substring(0, s) + "\t" + this.value.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;

    }
})

textArea.addEventListener("scroll", function(event){
    line.scrollTop =  textArea.scrollTop;
})

button.addEventListener("click", function(){
    var request = new XMLHttpRequest();
    request.open("POST" , "https://codequotient.com/api/executeCode");
    let data = {
        code : textArea.value,
        langId : lang.value
    }
    console.log(data);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data))

    request.addEventListener("load", function(event){
        let iresponse = JSON.parse(event.target.response);
        if(iresponse.error!=null){
            alert(iresponse.error);
            //console.log(nukul);
        }
        else{
            let codeId=iresponse.codeId;
            button.innerHTML="Compiling";
            setTimeout(function(){
                var output = new XMLHttpRequest();
                output.open("GET" , "https://codequotient.com/api/codeResult/"+ codeId);
                output.send();
                output.addEventListener("load", function(event){
                    let outres = JSON.parse(JSON.parse(event.target.response).data)
                    if(outres.output == null)
                        alert("error");
                    else {
                        if(outres.output!="")
                            outputB.innerHTML=outres.output;
                        else
                            outputB.innerHTML=outres.errors;
                    }
                })
                button.innerHTML="Compile";
            }, 2500)
        }
    })
})