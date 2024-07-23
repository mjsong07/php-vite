
/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params:any) {
    let result = ''
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + "=";
              result += subPart + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result
  }
  
  
  // 返回项目路径
  export function getNormalPath(p:any) {
    if (p.length === 0 || !p || p == 'undefined') {
      return p
    };
    let res = p.replace('//', '/')
    if (res[res.length - 1] === '/') {
      return res.slice(0, res.length - 1)
    }
    return res;
  }
  
  // 验证是否为blob格式
  export function blobValidate(data:any) {
    return data.type !== 'application/json'
  }
  
  const numUnitMap = {
    ge : {name:'',val:1}, //个位数
    qian : {name:'千',val:1000},//千位数
    wan : {name:'万',val:10000},//万位数
  }
  
  // 数字格式化
  export function formatNum(num:string,fixedDigit:number = 0,unit:string = 'ge') { 
    if(num === undefined) {
      return ''
    }
    let divideNum:number = numUnitMap[unit].val
    let unitName:number = numUnitMap[unit].name
    let numFixed = (Number(num) / divideNum ).toFixed(fixedDigit)
    let formatNum = `${numFixed}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${formatNum}${unitName}`
  }


  export function getCookie(name:string) {
      const value = "; " + document.cookie;
      const parts:Array<string> = value.split("; " + name + "=");
      if (parts.length === 2) {
        return parts.pop().split(";").shift(); 
      }
      return ''
  }
    
  export function retainNum(num,d){
    if(d === 0) {
      return Math.floor(Number(num) )
    }
    return parseFloat( (parseInt(Number(num)*100)/100).toFixed(d))
  }