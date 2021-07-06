"use strict";
let exposeFunc = {};
let ros = NaN;
let rosConnectReset = 0;
let bodyData = NaN; // @see https://dev.to/grrrisu/update-liveview-for-alpine-js-101-41pk
let formData = NaN;

document.addEventListener('alpine:init', () => {
  Alpine.store('wsList', ["localhost:9090"]);
})

function alpineGlobalInit(){
  bodyData = document.body._x_dataStack[0];
  formData = document.getElementById("task-creator")._x_dataStack[0];
};

function alpineGlobal(storeMagic){
  return {
    headerHeight: document.getElementsByTagName('header')[0].offsetHeight,
    hostModal: true,
    rosAddress: storeMagic.wsList[0],
    rosStatus: 1,
    rosErrorCode: 0,
    rosTask: [],
    ros_error(e) {
      console.log("[ER]"); console.log(e); //console.log(bodyData);
      bodyData.rosStatus = -1;
      bodyData.hostModal = true;
    },
    ros_close() {
      console.log("[CL]");
      if(bodyData.rosStatus == 1);

      bodyData.hostModal = true;
    },
    ros_connection() {
      console.log("[BU]");
      bodyData.rosStatus = 1;
      bodyData.hostModal = false;
    }/* the following func can be used...
    rosConnectCreate(wsAddress) {
      //console.log(this);
      this.rosStatus = 0;
      ros = new ROSLIB.Ros({
        url : 'ws://' + wsAddress
      });
      ros.on("error", this.ros_error);
      ros.on("connection", this.ros_connection);
      ros.on("close", this.ros_close);
    }*/
  }
}

function rosConnectCreate(wsAddress){
  bodyData.rosAddress = wsAddress;
  bodyData.rosStatus = 0;
  try {
    ros = new ROSLIB.Ros({
      url: 'ws://' + wsAddress
    });
    ros.on("error", bodyData.ros_error);
    ros.on("connection", bodyData.ros_connection);
    ros.on("close", bodyData.ros_close);
  } catch (error) {
    bodyData.rosErrorCode = 101;
    bodyData.ros_error(error);
  }
}

function rosTopicCreate (funcData) {
  //console.log(formData);
  if(funcData.method == 0) {
    var subscribeTopic = new ROSLIB.Topic({
      ros: ros,
      name: funcData.topic,
      messageType: funcData.type
    });
    var nowAt = bodyData.rosTask.push({
      action: {
        start: NaN,
        pause() {
          subscribeTopic.unsubscribe()
        }
      },
      message: "Waiting...",
      roslib: subscribeTopic,
      topic: funcData.topic,
      type: funcData.type
    }) - 1;
    var rosTaskNow = bodyData.rosTask[nowAt];
    rosTaskNow.action.start = function() {
      subscribeTopic.subscribe(function(funcMessage){
        rosTaskNow.message = funcMessage.msg;
        console.log(funcMessage);
      })
    }
    rosTaskNow.action.start();
    console.log(bodyData.rosTask[nowAt]);
  }
  else if(funcData.method == 1) {

  }
}
/* (function (){
  ros = new ROSLIB.Ros({
  });
  ros.on("error", function(e){

  });
  ros.on("connection", function(){

  });
  ros.on("close", function(){

  });
  */
/*var atopic = new ROSLIB.Topic({
  ros: ros, name: "/hrim_actuator_rotaryservo_000000000002/goal_axis1", messageType: "hrim_actuator_rotaryservo_msgs/msg/GoalRotaryServo"
});
var amess = new ROSLIB.Message({
  position: 1.2,
  velocity: 0.001,
  control_type: 1
})
atopic.publish(amess);
var btopic = new ROSLIB.Topic({
  ros: ros, name: "/hrim_actuator_rotaryservo_000000000002/state_axis1", messageType: "hrim_actuator_rotaryservo_msgs/msg/StateRotaryServo"
});
btopic.subscribe(function(message) {
      console.log(message);
btopic.unsubscribe();
});
// })(); // anonymous code block for publish
*/