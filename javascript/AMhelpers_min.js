function calculate(n,t,i){var r=document.getElementById(n).value,f,o,u,evalstr,res,e,h,s;for(r=r.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),r=r.replace(/=/,""),r=r.replace(/(\d)\s*,(?=\s*\d{3}\b)/g,"$1"),i.indexOf("list")!=-1?f=r.split(/,/):(f=[],f[0]=r),o=0;o<f.length;o++){if(str=f[o],u="",str.match(/DNE/i))str=str.toUpperCase();else if(str.match(/oo$/)||str.match(/oo\W/))str="`"+str+"`";else{u+=singlevalsyntaxcheck(str,i),str.match(/,/)&&(u+=_("Invalid use of a comma - it will be ignored and this expression may not evaluate as intended."),str=str.replace(/,/g,"")),i.indexOf("mixednumber")!=-1?str=str.replace(/_/," "):(str=str.replace(/([0-9])\s+([0-9])/g,"$1*$2"),str=str.replace(/\s/g,"")),u+=syntaxcheckexpr(str,i);try{evalstr=str,(i.indexOf("allowmixed")!=-1||i.indexOf("mixednumber")!=-1)&&(evalstr=evalstr.replace(/(\d+)\s+(\d+\s*\/\s*\d+)/,"($1+$2)")),i.indexOf("scinot")!=-1&&(evalstr=evalstr.replace("xx","*"));with(Math)res=eval(mathjs(evalstr))}catch(c){u=_("syntax incomplete")+". "+u,res=NaN}isNaN(res)||res=="Infinity"?str!=""&&(str="`"+str+"` = "+_("undefined")+". "+u):str=i.indexOf("fraction")!=-1||i.indexOf("reducedfraction")!=-1||i.indexOf("mixednumber")!=-1||i.indexOf("scinot")!=-1||i.indexOf("noval")!=-1?"`"+str+"` "+u:"`"+str+" =` "+(Math.abs(res)<1e-15?0:res)+". "+u}f[o]=str+" "}for(r=f.join(", "),e=document.getElementById(t),h=e.childNodes.length,s=0;s<h;s++)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r)),noMathRender||rendermathnode(e)}function ineqtointerval(n){var r=n.split(/or/),t;for(i=0;i<r.length;i++)str=r[i],t="",(pat=str.match(/^([^<]+)\s*(<=?)\s*([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+)\s*(<=?)([^<]+)$/))?(t+=pat[2]=="<="?"[":"(",t+=pat[1]+","+pat[5],t+=pat[4]=="<="?"]":")"):(pat=str.match(/^([^>]+)\s*(>=?)\s*([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+)\s*(>=?)([^>]+)$/))?(t+=pat[4]==">="?"[":"(",t+=pat[5]+","+pat[1],t+=pat[2]==">="?"]":")"):(pat=str.match(/^([^><]+)\s*([><]=?)\s*([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+)\s*$/))?pat[2]==">"?t="(-oo,"+pat[1]+")":pat[2]==">="?t="(-oo,"+pat[1]+"]":pat[2]=="<"?t="("+pat[1]+",oo)":pat[2]=="<="&&(t="["+pat[1]+",oo)"):(pat=str.match(/^\s*([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+)\s*([><]=?)\s*([^><]+)$/))?pat[2]=="<"?t="(-oo,"+pat[3]+")":pat[2]=="<="?t="(-oo,"+pat[3]+"]":pat[2]==">"?t="("+pat[3]+",oo)":pat[2]==">="&&(t="["+pat[3]+",oo)"):t=str.match(/all\s*real/i)?"(-oo,oo)":"",r[i]=t;return t=r.join("U")}function intcalculate(n,t,i){var r=document.getElementById(n).value,e,o,u,v,h,s,p,l,c,res,a,k,f;if(r=r.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),r=r.replace("∞","oo"),r=r.replace("≤","<="),r=r.replace("≥",">="),r.match(/DNE/i))r=r.toUpperCase();else if(r.replace(/\s+/g,"")=="")r=_("no answer given");else{if(e=[],o=[],i.indexOf("inequality")!=-1){r=r.replace(/or/g," or "),u=r,r=ineqtointerval(r);var b=str.match(/\b([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+\b)/),w=str.match(/([a-zA-Z]\(\s*[a-zA-Z]\s*\)|[a-zA-Z]+)/),y=b!=null?b[1]:w!=null?w[1]:""}else r=r.replace(/\s+/g,"");if(i.indexOf("list")!=-1){for(v=0,s=[],h=1;h<r.length-1;h++)r.charAt(h)==","&&(r.charAt(h-1)==")"||r.charAt(h-1)=="]")&&(r.charAt(h+1)=="("||r.charAt(h+1)=="[")&&(s.push(r.substring(v,h)),v=h+1);s.push(r.substring(v))}else s=r.split(/U/);for(p=!0,l="",f=0;f<s.length;f++){if(str=s[f],sm=str.charAt(0),em=str.charAt(str.length-1),vals=str.substring(1,str.length-1),vals=vals.split(/,/),vals.length!=2){r=_("syntax incomplete"),p=!1;break}for(j=0;j<2;j++)if(vals[j].match(/oo$/)||vals[j].match(/oo\W/))e[j]=vals[j];else{if(c="",res=NaN,c+=singlevalsyntaxcheck(vals[j],i),vals[j]=i.indexOf("mixednumber")!=-1?vals[j].replace(/_/," "):vals[j].replace(/\s/g,""),c+=syntaxcheckexpr(vals[j],i),c=="")try{with(Math)res=eval(mathjs(vals[j]))}catch(d){c=_("syntax incomplete")+". "}isNaN(res)||res=="Infinity"?e[j]=_("undefined"):(vals[j]=vals[j],e[j]=(Math.abs(res)<1e-15?0:res)+c),c!=""&&(l+=c)}s[f]=sm+vals[0]+","+vals[1]+em,i.indexOf("inequality")!=-1?(o[f]=e[0].match(/oo/)?e[1].match(/oo/)?"RR":y+(em=="]"?"le":"lt")+e[1]:e[1].match(/oo/)?y+(sm=="["?"ge":"gt")+e[0]:e[0]+(sm=="["?"le":"lt")+y+(em=="]"?"le":"lt")+e[1],o[f]=o[f].replace("undefined",'"undefined"')):o[f]=sm+e[0]+","+e[1]+em}p&&(i.indexOf("inequality")!=-1?u.match(/all\s*real/)?r=u:(u=u.replace(/or/g,' \\ "or" \\ '),u=u.replace(/<=/g,"le"),u=u.replace(/>=/g,"ge"),u=u.replace(/</g,"lt"),u=u.replace(/>/g,"gt"),r=i.indexOf("fraction")!=-1||i.indexOf("reducedfraction")!=-1||i.indexOf("mixednumber")!=-1||i.indexOf("scinot")!=-1||i.indexOf("noval")!=-1?"`"+u+"`. "+l:"`"+u+"= "+o.join(' \\ "or" \\ ')+"`. "+l):r=i.indexOf("fraction")!=-1||i.indexOf("reducedfraction")!=-1||i.indexOf("mixednumber")!=-1||i.indexOf("scinot")!=-1||i.indexOf("noval")!=-1?"`"+s.join("uu")+"`. "+l:i.indexOf("list")!=-1?"`"+s.join(",")+"` = "+o.join(" , ")+". "+l:"`"+s.join("uu")+"` = "+o.join(" U ")+". "+l)}for(a=document.getElementById(t),k=a.childNodes.length,f=0;f<k;f++)a.removeChild(a.firstChild);a.appendChild(document.createTextNode(r)),noMathRender||rendermathnode(a)}function ntuplecalc(n,t,i){var r=document.getElementById(n).value,res,e,c,u;if(r=r.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),r=r.replace(/\s+/g,""),r.match(/DNE/i))r=r.toUpperCase(),f="DNE",outstr="DNE";else{var f="",o=0,h=0,s="";for(u=0;u<r.length;u++)if(dec=!1,o==0&&(f+=r.charAt(u),h=u+1),r.charAt(u).match(/[\(\[\<\{]/)?o++:r.charAt(u).match(/[\)\]\>\}]/)&&(o--,dec=!0),o==0&&dec||o==1&&r.charAt(u)==","){sub=r.substring(h,u),res=NaN;try{with(Math)res=eval(mathjs(sub))}catch(l){s+=_("syntax incomplete")+". "}s+=singlevalsyntaxcheck(sub,i),sub=i.indexOf("mixednumber")!=-1?sub.replace(/_/," "):sub.replace(/\s/g,""),s+=syntaxcheckexpr(sub,i),f+=isNaN(res)||res=="Infinity"?_("undefined"):res,f+=r.charAt(u),h=u+1}outstr=i.indexOf("fraction")!=-1||i.indexOf("reducedfraction")!=-1||i.indexOf("mixednumber")!=-1||i.indexOf("scinot")!=-1||i.indexOf("noval")!=-1?"`"+r+"`. "+s:"`"+r+"` = "+f+". "+s}if(t!=null){for(e=document.getElementById(t),c=e.childNodes.length,u=0;u<c;u++)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(outstr)),noMathRender||rendermathnode(e)}return f}function complexcalc(n,t,i){var r=document.getElementById(n).value,f,prep,h,real,imag,o,l,c;if(r=r.replace(/\s+/g,""),r.match(/DNE/i))r=r.toUpperCase(),e="DNE",outstr="DNE";else{var e="",u="",s=r.split(",");for(f=0;f<s.length;f++){prep=mathjs(s[f],"i"),i.indexOf("sloppycomplex")==-1&&(h=parsecomplex(s[f]),u+=singlevalsyntaxcheck(h[0],i),u+=singlevalsyntaxcheck(h[1],i)),u+=syntaxcheckexpr(s[f],i);try{with(Math)real=scopedeval("var i=0;"+prep);with(Math)imag=scopedeval("var i=1;"+prep)}catch(a){u+=_("syntax incomplete")}if((real=="synerr"||imag=="synerr")&&(u+=_("syntax incomplete"),real=NaN),isNaN(real)||real=="Infinity"||isNaN(imag)||imag=="Infinity"){e+=_("undefined");break}else imag-=real,f!=0&&(e+=","),e+=real+(imag>=0?"+":"")+imag+"i"}outstr=i.indexOf("fraction")!=-1||i.indexOf("reducedfraction")!=-1||i.indexOf("mixednumber")!=-1||i.indexOf("scinot")!=-1||i.indexOf("noval")!=-1?"`"+r+"`. "+u:"`"+r+"` = "+e+". "+u}if(t!=null){for(o=document.getElementById(t),l=o.childNodes.length,c=0;c<l;c++)o.removeChild(o.firstChild);o.appendChild(document.createTextNode(outstr)),noMathRender||rendermathnode(o)}return e}function parsecomplex(n){var r,t,f,o,i,e,u,s;if(n=n.replace(/\s/,""),n=n.replace(/sin/,"s$n"),n=n.replace(/pi/,"p$"),s=n.length,n.split("i").length>2)return _("error - more than 1 i in expression");if(i=n.indexOf("i"),i==-1)r=n,t="0";else{for(o=0,u=i-1;u>0;u--)if(f=n.charAt(u),f==")")o++;else if(f=="(")o--;else if((f=="+"||f=="-")&&o==0)break;for(o=0,e=i+1;e<s;e++)if(f=n.charAt(e),f=="(")o++;else if(f==")")o--;else if((f=="+"||f=="-")&&o==0)break;if(i-u>1&&e-i>1)return _("error - invalid form");if(i-u>1)t=n.substr(u,i-u),r=n.substr(0,u)+n.substr(i+1);else if(e-i>1)if(i>0){if(n.charAt(i-1)!="+"&&n.charAt(i-1)!="-")return _("error - invalid form");t=n.charAt(i-1)+n.substr(i+1+(n.charAt(i+1)=="*"?1:0),e-i-1),r=n.substr(0,i-1)+n.substr(e)}else t=n.substr(i+1,e-i-1),r=n.substr(0,i)+n.substr(e);else t=n.charAt(u)=="+"?"1":n.charAt(u)=="-"?"-1":i==0?"1":n.charAt(u),r=(i>0?n.substr(0,u):"")+n.substr(i+1);r==""&&(r="0"),t.charAt(0)=="/"?t="1"+t:(t.charAt(0)=="+"||t.charAt(0)=="-")&&t.charAt(1)=="/"&&(t=t.charAt(0)+"1"+t.substr(1)),t.charAt(t.length-1)=="*"&&(t=t.substr(0,t.length-1)),t.charAt(0)=="+"&&(t=t.substr(1)),r.charAt(0)=="+"&&(r=r.substr(1))}return r=r.replace("s$n","sin"),r=r.replace("p$","pi"),t=t.replace("s$n","sin"),t=t.replace("p$","pi"),[r,t]}function matrixcalc(n,t,i,r){function p(estr){var n="",res;try{with(Math)res=eval(mathjs(estr))}catch(t){n=_("syntax incomplete")}return isNaN(res)||res=="Infinity"?estr!=""&&(estr=_("undefined")):estr=(Math.abs(res)<1e-15?0:res)+n,estr}var l,a,o,c,h,s,w,f;if(i!=null&&r!=null){var v=0,e="[",u="[";for(l=0;l<i;l++){for(l>0&&(e+=",",u+=","),e+="(",u+="(",a=0;a<r;a++)a>0&&(e+=",",u+=","),e+=document.getElementById(n+"-"+v).value,u+=p(document.getElementById(n+"-"+v).value),v++;e+=")",u+=")"}e+="]",u+="]"}else{var e=document.getElementById(n).value,u=e,y=0;for(u=u.replace("[","("),u=u.replace("]",")"),u=u.replace(/\s+/g,""),o=[],u=u.substring(1,u.length-1),c=0,f=0;f<u.length;f++)u.charAt(f)=="("?y++:u.charAt(f)==")"?y--:u.charAt(f)==","&&y==0&&(o[o.length]=u.substring(c+1,f-1),c=f+1);for(o[o.length]=u.substring(c+1,u.length-1),f=0;f<o.length;f++){for(calclist2=o[f].split(","),h=0;h<calclist2.length;h++)calclist2[h]=p(calclist2[h]);o[f]=calclist2.join(",")}u="[("+o.join("),(")+")]"}if(e="`"+e+"` = `"+u+"`",t!=null){for(s=document.getElementById(t),w=s.childNodes.length,f=0;f<w;f++)s.removeChild(s.firstChild);s.appendChild(document.createTextNode(e)),noMathRender||rendermathnode(s)}return u}function mathjsformat(n,t){var i=document.getElementById(n).value,r=document.getElementById(t);r.value=mathjs(i)}function stringqpreview(n,t){for(var u=document.getElementById(n).value,i=document.getElementById(t),f=i.childNodes.length,r=0;r<f;r++)i.removeChild(i.firstChild);i.appendChild(document.createTextNode("`"+u+"`")),noMathRender||rendermathnode(i)}function AMpreview(n,t){var o=n.slice(2),s=vlist[o],b=flist[o],r,p,h,y,l,e,k,i,w,totest,f,u,res,c;for(vars=s.split("|"),r=document.getElementById(n).value,r=r.replace(/,/g,""),r=r.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),p=r,i=0;i<vars.length;i++)vars[i].charCodeAt(0)>96?arraysearch(vars[i].toUpperCase(),vars)==-1&&(r=r.replace(new RegExp(vars[i],"gi"),vars[i])):arraysearch(vars[i].toLowerCase(),vars)==-1&&(r=r.replace(new RegExp(vars[i],"gi"),vars[i]));for(s=vars.join("|"),h=[],i=0;i<vars.length;i++)if(vars[i].length>1){for(y=!1,f=0;f<greekletters.length;f++)if(vars[i]==greekletters[f]){y=!0;break}y||vars[i].match(/^(\w)_\d+$/)||h.push(vars[i])}for(h.length>0&&(vltq=h.join("|"),l=new RegExp("("+vltq+")","g"),p=r.replace(l,'"$1"')),e=document.getElementById(t),k=e.childNodes.length,i=0;i<k;i++)e.removeChild(e.firstChild);e.appendChild(document.createTextNode("`"+p+"`")),noMathRender||rendermathnode(e),ptlist=pts[o].split(",");var v=0,res=NaN,a=!1;for(iseqn[o]==1&&(r.match(/=/)?r.match(/=/g).length>1&&(a=!0):a=!0,r=r.replace(/(.*)=(.*)/,"$1-($2)")),b!=""&&(l=new RegExp("("+b+")\\(","g"),r=r.replace(l,"$1*sin($1+")),vars=s.split("|"),w=mathjs(r,s);v<ptlist.length&&(isNaN(res)||res=="Infinity");){for(totest="",testvals=ptlist[v].split("~"),f=0;f<vars.length;f++)totest+="var "+vars[f]+"="+testvals[f]+";";totest+=w,u=_("syntax ok");try{with(Math)res=scopedeval(totest)}catch(d){u=_("syntax error")}res=="synerr"&&(u=_("syntax error")),v++}c=syntaxcheckexpr(r,"",s),(isNaN(res)||res=="Infinity")&&(u=_("syntax error")),c!=""&&(u+=u==_("syntax ok")?". "+_("warning")+": "+c:". "+c),iseqn[o]==1&&a&&(u=_("syntax error: this is not an equation")),e.appendChild(document.createTextNode(" "+u))}function AMmathpreview(n,t){for(var u=document.getElementById(n).value,i=document.getElementById(t),f=i.childNodes.length,r=0;r<f;r++)i.removeChild(i.firstChild);i.appendChild(document.createTextNode("`"+u+"`")),noMathRender||rendermathnode(i)}function singlevalsyntaxcheck(n,t){if(n.match(/DNE/i)||n.match(/oo$/)||n.match(/oo\W/))return"";if(t.indexOf("fraction")!=-1||t.indexOf("reducedfraction")!=-1){if(n=n.replace(/\s/g,""),!n.match(/^\(?\-?\(?\d+\)?\/\(?\d+\)?$/)&&!n.match(/^\(?\d+\)?\/\(?\-?\d+\)?$/)&&!n.match(/^\s*?\-?\d+\s*$/))return _("not a valid fraction")+". "}else if(t.indexOf("fracordec")!=-1){if(n=n.replace(/\s/g,""),!n.match(/^\-?\(?\d+\s*\/\s*\-?\d+\)?$/)&&!n.match(/^\-?\d+$/)&&!n.match(/^\-?(\d+|\d+\.\d*|\d*\.\d+)$/))return _(" invalid entry format")+". "}else if(t.indexOf("mixednumber")!=-1){if(!n.match(/^\s*\-?\s*\d+\s*(_|\s)\s*\d+\s*\/\s*\d+\s*$/)&&!n.match(/^\s*?\-?\d+\s*$/)&&!n.match(/^\s*\-?\d+\s*\/\s*\-?\d+\s*$/))return _("not a valid mixed number")+". ";n=n.replace(/_/," ")}else if(t.indexOf("scinot")!=-1&&(n=n.replace(/\s/g,""),n=n.replace(/(x|X|\u00D7)/,"xx"),!n.match(/^\-?[1-9](\.\d*)?(\*|xx)10\^(\(?\-?\d+\)?)$/)))return _("not valid scientific notation")+". ";return""}function syntaxcheckexpr(n,t,i){var u="",f,e,r;for(t.indexOf("notrig")!=-1&&n.match(/(sin|cos|tan|cot|sec|csc)/)?u+=_("no trig functions allowed")+". ":t.indexOf("nodecimal")!=-1&&n.indexOf(".")!=-1&&(u+=_("no decimals allowed")+". "),f=0,e=0,r=0;r<n.length;r++)n.charAt(r)=="("?f++:n.charAt(r)==")"?f--:n.charAt(r)=="["?e++:n.charAt(r)=="]"&&e--;return(f!=0||e!=0)&&(u+=" ("+_("unmatched parens")+"). "),reg=i?new RegExp("(sqrt|ln|log|sinh|cosh|tanh|sech|csch|coth|sin|cos|tan|sec|csc|cot|abs)s*("+i+"|\\d+)"):new RegExp("(sqrt|ln|log|sinh|cosh|tanh|sech|csch|coth|sin|cos|tan|sec|csc|cot|abs)s*(\\d+)"),errstuff=n.match(reg),errstuff!=null&&(u+="["+_("use function notation")+" - "+_("use $1 instead of $2",errstuff[1]+"("+errstuff[2]+")",errstuff[0])+"]. "),n.match(/\|/)&&(u+=_(" Use abs(x) instead of |x| for absolute values")+". "),u}function doonsubmit(n,t,i){var c,s,f,l,u,e,res,r,j,h,fj,o;for(r in callbackstack)callbackstack[r](r);if(n!=null){if(n.className=="submitted")return alert(_("You have already submitted this page.  Please be patient while your submission is processed.")),n.className="submitted2",!1;if(n.className=="submitted2")return!1;if(n.className="submitted",!i&&(c=t?confirmSubmit2(n):confirmSubmit(n),!c))return n.className="",!1}for(r in intcalctoproc){if(r=parseInt(r),fullstr=document.getElementById("tc"+r).value,fullstr=fullstr.replace(/\s+/g,""),fullstr=fullstr.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),fullstr=fullstr.replace("∞","oo"),fullstr=fullstr.replace("≤","<="),fullstr=fullstr.replace("≥",">="),fullstr.match(/DNE/i))fullstr=fullstr.toUpperCase();else{if(calcformat[r].indexOf("inequality")!=-1&&(fullstr=ineqtointerval(fullstr)),calcformat[r].indexOf("list")!=-1){for(s=0,u=[],f=1;f<fullstr.length-1;f++)fullstr.charAt(f)==","&&(fullstr.charAt(f-1)==")"||fullstr.charAt(f-1)=="]")&&(fullstr.charAt(f+1)=="("||fullstr.charAt(f+1)=="[")&&(u.push(fullstr.substring(s,f)),s=f+1);u.push(fullstr.substring(s))}else u=fullstr.split(/U/);for(k=0;k<u.length;k++)if(str=u[k],str.length>0&&str.match(/,/)){for(sm=str.charAt(0),em=str.charAt(str.length-1),vals=str.substring(1,str.length-1),vals=vals.split(/,/),j=0;j<2;j++)if(!vals[j].match(/oo$/)&&!vals[j].match(/oo\W/)){l="";try{with(Math)res=eval(mathjs(vals[j]))}catch(a){l="syntax incomplete"}isNaN(res)||res=="Infinity"||(vals[j]=(Math.abs(res)<1e-15?0:res)+l)}u[k]=sm+vals[0]+","+vals[1]+em}fullstr=calcformat[r].indexOf("list")!=-1?u.join(","):u.join("U")}document.getElementById("qn"+r).value=fullstr}for(r in calctoproc){for(r=parseInt(r),str=document.getElementById("tc"+r).value,str=str.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),calcformat[r].indexOf("list")!=-1?u=str.split(/,/):(u=[],u[0]=str),e=0;e<u.length;e++){if(str=u[e],str=str.replace(/,/g,""),calcformat[r].indexOf("scinot")!=-1&&(str=str.replace(/(x|X|\u00D7)/,"*")),str=str.replace(/(\d+)\s*_\s*(\d+\s*\/\s*\d+)/,"($1+$2)"),(calcformat[r].indexOf("mixednumber")!=-1||calcformat[r].indexOf("allowmixed")!=-1)&&(str=str.replace(/(\d+)\s+(\d+\s*\/\s*\d+)/,"($1+$2)")),str.match(/^\s*$/))res="";else if(str.match(/oo$/)||str.match(/oo\W/))res=str;else if(str.match(/DNE/i))res=str.toUpperCase();else try{with(Math)res=eval(mathjs(str))}catch(a){res=""}u[e]=res}document.getElementById("qn"+r).value=u.join(",")}for(r in matcalctoproc)r=parseInt(r),matsize[r]!=null?(msize=matsize[r].split(","),str=matrixcalc("qn"+r,null,msize[0],msize[1])):str=matrixcalc("tc"+r,null),document.getElementById("qn"+r).value=str;for(r in ntupletoproc)r=parseInt(r),str=ntuplecalc("tc"+r,null,""),document.getElementById("qn"+r).value=str;for(r in complextoproc)r=parseInt(r),str=complexcalc("tc"+r,null,""),document.getElementById("qn"+r).value=str;for(r in functoproc){for(r=parseInt(r),str=document.getElementById("tc"+r).value,str=str.replace(/,/g,""),str=str.replace(/\u2013|\u2014|\u2015/g,"-").replace(/\u2044/g,"/"),iseqn[r]==1&&(str=str.replace(/(.*)=(.*)/,"$1-($2)")),fl=flist[r],varlist=vlist[r],vars=varlist.split("|"),j=0;j<vars.length;j++)vars[j].charCodeAt(0)>96?arraysearch(vars[j].toUpperCase(),vars)==-1&&(str=str.replace(new RegExp(vars[j],"gi"),vars[j])):arraysearch(vars[j].toLowerCase(),vars)==-1&&(str=str.replace(new RegExp(vars[j],"gi"),vars[j]));for(varlist=vars.join("|"),fl!=""&&(reg=new RegExp("("+fl+")\\(","g"),str=str.replace(reg,"$1*sin($1+")),vars=varlist.split("|"),h=document.getElementById("qn"+r),h.value=mathjs(str,varlist),ptlist=pts[r].split(","),vals=[],fj=0;fj<ptlist.length;fj++){for(inputs=ptlist[fj].split("~"),totest="",o=0;o<inputs.length;o++)totest+="var "+vars[o]+"="+inputs[o]+";";totest+=h.value==""?Math.random()+";":h.value+";";try{with(Math)vals[fj]=scopedeval(totest)}catch(a){vals[fj]=NaN}vals[fj]=="synerr"&&(vals[fj]=NaN)}document.getElementById("qn"+r+"-vals").value=vals.join(",")}return!0}function scopedeval(c){var res;try{with(Math)res=eval(c);return res}catch(n){return"synerr"}}function arraysearch(n,t){for(var i=0;i<t.length;i++)if(t[i]==n)return i;return-1}function toggleinlinebtn(n,t){var r=document.getElementById(n),u,i;r.style.display=r.style.display=="none"?"":"none",t!=null&&(u=document.getElementById(t),i=u.innerHTML,u.innerHTML=i.match(/\+/)?i.replace(/\+/,"-"):i.replace(/\-/,"+"))}function assessbackgsubmit(n,t){var u,f,r,i;if(t!=null&&document.getElementById(t).innerHTML==_("Submitting..."))return!1;if(window.XMLHttpRequest?req=new XMLHttpRequest:window.ActiveXObject&&(req=new ActiveXObject("Microsoft.XMLHTTP")),typeof req!="undefined"){if(typeof tinyMCE!="undefined"&&tinyMCE.triggerSave(),doonsubmit(),params="embedpostback=true",n!=null){for(r=[],u=document.getElementsByTagName("input"),i=0;i<u.length;i++)r.push(u[i]);for(u=document.getElementsByTagName("select"),i=0;i<u.length;i++)r.push(u[i]);for(u=document.getElementsByTagName("textarea"),i=0;i<u.length;i++)r.push(u[i]);for(f=new RegExp("^(qn|tc)("+n+"\\b|"+(n+1)+"\\d{3})"),i=0;i<r.length;i++)r[i].name.match(f)&&(r[i].type!="radio"&&r[i].type!="checkbox"||r[i].checked)&&(params+="&"+r[i].name+"="+encodeURIComponent(r[i].value));params+="&toscore="+n,params+="&verattempts="+document.getElementById("verattempts"+n).value}else{for(r=document.getElementsByTagName("input"),i=0;i<r.length;i++)r[i].name.match(/^(qn|tc)/)&&(r[i].type!="radio"||r[i].type!="checkbox"||r[i].checked)&&(params+="&"+r[i].name+"="+encodeURIComponent(r[i].value));params+="&verattempts="+document.getElementById("verattempts").value}params+="&asidverify="+document.getElementById("asidverify").value,params+="&disptime="+document.getElementById("disptime").value,params+="&isreview="+document.getElementById("isreview").value,t!=null&&(document.getElementById(t).innerHTML=_("Submitting...")),req.open("POST",assesspostbackurl,!0),req.setRequestHeader("Content-type","application/x-www-form-urlencoded"),req.setRequestHeader("Content-length",params.length),req.setRequestHeader("Connection","close"),req.onreadystatechange=function(){assessbackgsubmitCallback(n,t)},req.send(params)}else t!=null&&(document.getElementById(t).innerHTML=_("Error Submitting."))}function assessbackgsubmitCallback(qn,noticetgt){var scripts,resptxt,i,foo,pagescroll,B,D,elpos;if(req.readyState==4)if(req.status==200){if(noticetgt!=null&&(document.getElementById(noticetgt).innerHTML=""),qn!=null){for(scripts=[],resptxt=req.responseText;resptxt.indexOf("<script")>-1||resptxt.indexOf("</script")>-1;){var s=resptxt.indexOf("<script"),s_e=resptxt.indexOf(">",s),e=resptxt.indexOf("</script",s),e_e=resptxt.indexOf(">",e);scripts.push(resptxt.substring(s_e+1,e)),resptxt=resptxt.substring(0,s)+resptxt.substring(e_e+1)}for(document.getElementById("embedqwrapper"+qn).innerHTML=resptxt,usingASCIIMath&&rendermathnode(document.getElementById("embedqwrapper"+qn)),usingASCIISvg&&setTimeout("drawPics()",100),usingTinymceEditor&&initeditor("textareas","mceEditor"),initstack.length=0,i=0;i<scripts.length;i++)try{(k=scripts[i].match(/canvases\[(\d+)\]/))&&(typeof G_vmlCanvasManager!="undefined"&&(scripts[i]=scripts[i]+'G_vmlCanvasManager.initElement(document.getElementById("canvas'+k[1]+'"));'),scripts[i]=scripts[i]+"initCanvases("+k[1]+");"),eval(scripts[i])}catch(ex){}for(i=0;i<initstack.length;i++)foo=initstack[i]();initcreditboxes(),pagescroll=0,typeof window.pageYOffset!="undefined"?pagescroll=window.pageYOffset:(B=document.body,D=document.documentElement,D=D.clientHeight?D:B,pagescroll=D.scrollTop),elpos=findPos(document.getElementById("embedqwrapper"+qn))[1],pagescroll>elpos&&setTimeout(function(){window.scroll(0,elpos)},150)}}else noticetgt!=null&&(document.getElementById(noticetgt).innerHTML=_("Submission Error")+":\n"+req.status+"\n"+req.statusText)}function AutoSuggest(n,t){var r=this,s;this.elem=n,this.suggestions=t,this.eligible=[],this.inputText=null,this.highlighted=-1,this.div=document.getElementById("autosuggest"),this.div==null&&(this.div=document.createElement("div"),this.div.id="autosuggest",document.getElementsByTagName("body")[0].appendChild(this.div),this.div.appendChild(document.createElement("ul")));var u=9,f=27,e=38,o=40,h=13;n.setAttribute("autocomplete","off"),n.id||(s="autosuggest"+AutoSuggestIdCounter,AutoSuggestIdCounter++,n.id=s),n.onkeydown=function(n){var t=r.getKeyCode(n);switch(t){case u:r.useSuggestion("tab");break;case h:return r.useSuggestion("enter"),!1;case f:r.hideDiv();break;case e:r.highlighted>0&&r.highlighted--,r.changeHighlight(t);break;case o:r.highlighted<r.eligible.length-1&&r.highlighted++,r.changeHighlight(t)}},n.onkeyup=function(n){var t=r.getKeyCode(n);switch(t){case u:case f:case e:case o:return;default:this.value.length>1?(r.inputText=this.value,r.getEligible(),r.highlighted=r.eligible.length>0?0:-1,r.createDiv(),r.positionDiv(),r.showDiv()):(r.hideDiv(),this.value.length==0&&(r.inputText=""))}},n.onblur=function(){setTimeout(r.hideDiv,100)},this.useSuggestion=function(){this.highlighted>-1?(this.elem.value=this.eligible[this.highlighted],this.hideDiv()):this.hideDiv()},this.showDiv=function(){this.div.style.display="block"},this.hideDiv=function(){r.div.style.display="none",r.highlighted=-1},this.changeHighlight=function(){var t=this.div.getElementsByTagName("LI"),n;for(i in t)n=t[i],n.className=this.highlighted==i?"selected":""},this.positionDiv=function(){var t=this.elem,n=findPos(t);n[1]+=t.offsetHeight,this.div.style.left=n[0]+"px",this.div.style.top=n[1]+"px"},this.createDiv=function(){var n=document.createElement("ul");for(i in this.eligible){var f=this.eligible[i],u=document.createElement("li"),t=document.createElement("a");t.href="#",t.onclick=function(){return!1},t.innerHTML=f,u.appendChild(t),r.highlighted==i&&(u.className="selected"),n.appendChild(u)}this.div.replaceChild(n,this.div.childNodes[0]),n.onmouseover=function(n){for(var t=r.getEventSource(n),u,f;t.parentNode&&t.tagName.toUpperCase()!="LI";)t=t.parentNode;u=r.div.getElementsByTagName("LI");for(i in u)if(f=u[i],f==t){r.highlighted=i;break}r.changeHighlight()},n.onclick=function(n){return r.useSuggestion("click"),r.hideDiv(),r.cancelEvent(n),!1},this.div.className="suggestion_list",this.div.style.position="absolute"},this.getEligible=function(){var r,t,n;if(this.eligible=[],r=",",this.inputText.indexOf(" ")==-1){t=new RegExp("\\b"+this.inputText.toLowerCase());for(i in this.suggestions)n=this.suggestions[i],n.toLowerCase().match(t)&&(this.eligible[this.eligible.length]=n,r+=i+",")}},this.getKeyCode=function(n){return n?n.keyCode:window.event?window.event.keyCode:void 0},this.getEventSource=function(n){return n?n.target:window.event?window.event.srcElement:void 0},this.cancelEvent=function(n){n&&(n.preventDefault(),n.stopPropagation()),window.event&&(window.event.returnValue=!1)}}function isBlank(n){return!n||0===n.length||/^\s*$/.test(n)}function editdebit(n){var t=$("#qn"+(n.id.substr(2)*1-1));!isBlank(n.value)&&t.hasClass("iscredit")&&(t.is("select")?t.css("margin-right",20):t.width(t.width()+20),t.css("padding-left",0),t.removeClass("iscredit"))}function editcredit(n){var t=$("#qn"+(n.id.substr(2)*1-2));isBlank(n.value)||t.hasClass("iscredit")||(t.is("select")?t.css("margin-right",0):t.width(t.width()-20),t.css("padding-left",20),t.addClass("iscredit"))}function initcreditboxes(){$(".creditbox").each(function(n,t){if(!isBlank(t.value)&&$(t).css("padding-left")!=20){var i=$("#qn"+(t.id.substr(2)*1-2));i.is("select")?i.css("margin-right",0):i.width(i.width()-20),i.css("padding-left",20),i.addClass("iscredit")}})}var greekletters=["alpha","beta","delta","epsilon","gamma","phi","psi","sigma","rho","theta","lambda","mu","nu"],calctoproc={},intcalctoproc={},calcformat={},functoproc={},matcalctoproc={},ntupletoproc={},complextoproc={},callbackstack={},matsize={},vlist={},flist={},pts={},iseqn={},AutoSuggestIdCounter=0;initstack.push(initcreditboxes);