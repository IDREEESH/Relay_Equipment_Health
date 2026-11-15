(function(root){
const names=['Edge processor','Sensor station','Power module'];
class Simulation{
 constructor(){this.time=0;this.events=[];this.devices=names.map((name,i)=>({id:`NODE-0${i+1}`,name,temp:42+i*3,battery:94-i*9,lastSeen:0,heat:false,drop:false,low:false,status:'Healthy',history:[]}));this.add('SYSTEM','Session started','Three simulated devices connected.','info');}
 add(device,event,detail,severity='info'){this.events.push({time:this.time,device,event,detail,severity});if(this.events.length>1000)this.events.shift();}
 classify(d){const age=this.time-d.lastSeen;if(age>=8)return 'Offline';if(age>=4)return 'Stale';if(d.temp>=80)return 'Critical';if(d.temp>=65||d.battery<=20)return 'Warning';return 'Healthy';}
 fault(i,type){const d=this.devices[i];if(type==='heat')d.heat=true;if(type==='drop')d.drop=true;if(type==='battery')d.low=true;if(type==='recover'){d.heat=false;d.drop=false;d.low=false;}this.add(d.id,type==='recover'?'Recovery requested':'Fault injected',{heat:'Temperature ramp enabled.',drop:'Telemetry transmission stopped.',battery:'Low battery condition enabled.',recover:'Faults cleared; telemetry and temperature recover on subsequent ticks.'}[type]);}
 tick(){this.time++;this.devices.forEach((d,i)=>{if(!d.drop){const base=42+i*3+Math.sin(this.time/5+i)*2;d.temp=d.heat?Math.min(96,d.temp+3):Math.max(base,d.temp-4);d.battery=d.low?15:Math.max(30,94-i*9-this.time*.012);d.lastSeen=this.time;}const next=this.classify(d);if(next!==d.status){this.add(d.id,next==='Healthy'?'Recovered':next,`${d.status} → ${next}; ${d.temp.toFixed(1)}°C, ${Math.round(d.battery)}% battery, telemetry age ${this.time-d.lastSeen}s.`,next==='Healthy'?'info':'alert');d.status=next;}d.history.push({time:this.time,temp:d.drop?null:d.temp});if(d.history.length>60)d.history.shift();});}
}
root.Simulation=Simulation;if(typeof module!=='undefined')module.exports=Simulation;
})(typeof window!=='undefined'?window:globalThis);
