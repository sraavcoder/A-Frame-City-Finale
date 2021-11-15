var modelList = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("barcode_value");
      modelList.push({ model_name: modelName, barcode_value: barcodeValue });

      var model = document.querySelector(`#${modelName}`);
      model.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = elementsArray.findIndex(x => x.model_name === modelName);
      if (index > -1) {
        modelList.splice(index, 1);
      }
    });
  },

  modelPresentInArray: function (arr, val){
      for(var i in arr){
          if(i.model_name === val){
              return true;
          }
      }
  },

  tick: function () {
    if (modelList.length > 1) {
        var isBaseModelPresent = this.modelPresentInArray(modelList, "base");
        var messageText = document.querySelector("#message-text");

        if(!isBaseModelPresent){
          messageText.setAttribute("visible", true);
        }else{
          if(model === null)
          model = await this.getModels()
        }

        messageText.setAttribute("visible",false);
        this.placeTheModel("road", model);
        this.placeTheModel("car", model);
        this.placeTheModel("building1", model);
        this.placeTheModel("building2", model);
        this.placeTheModel("building3", model);
        this.placeTheModel("tree", model);
        this.placeTheModel("sun", model);
    }
  },

  placeTheModel: function(modelName, models){
    var isListContainModel = this.modalPresentInArray(modelList,modelName);
    if(isListContainModel){
      var distance = null;
      var marker1 = document.querySelector("#marker-base");
      var marker2 = document.querySelector(`#marker-${modelName}`);

      distance = this.getDistance(marker1, marker2);
      if(distance < 1.25){
        var modelEl = document.querySelector(`#${modelName}`);
        modelEl.setAttribute("visible",false);

        var isModelPlaced = document.querySelector(`#model-${modelName}`);
        if(isModelPlaced === null){
          var el = document.createElement("a-entity");
          var modelGeometry = this.getModelGeometry(models,modelName);
          el.setAttribute("id", `model-${modelName}`);
          el.setAttribute("gltf-model",`url(${modelGeometry.model_url})`);
          el.setAttribute("position", modelGeometry.position);
          el.setAttribute("rotation", modelGeometry.rotation);
          el.setAttribute("scale", modelGeometry.scale);
          marker1.appendChild(el);
        }
      }
    }
  },
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  getModelGeometry: function (models, modelName) {
    var barcodes = Object.key(models);
    console.log("barcodesArray",barcodes);
    for(var barcode of barcodes) {
        if(models[barcode].model_name === modelName){
            return{
                position: models[barcode]["placement_position"],
                rotation: models[barcode]["placement_rotation"],
                scale: models[barcode]["placement_scale"],
                model_url: models[barcode]["model_url"]
            }
        }
    }
  },
  isModelPresentInArray: function (arr, val) {
    for(var i of arr){
      if(i.model_name === val){
        return true;
      }
    }
    return false;
  }
});
