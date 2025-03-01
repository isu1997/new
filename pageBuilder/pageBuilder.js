document.addEventListener('DOMContentLoaded', function() {
  // Initialize the page builder
  initPageBuilder();

  function initPageBuilder() {
    /*--------textarea, its text color and text size-----------*/
    const textBox = document.getElementById("txt-area");
    const textColor = document.getElementById("txt-color");
    const textSize = document.getElementById("txt-size");

    /*-------------------border variables-----------------*/
    /*-----------border size,style,color,border-radius-----------*/
    const boxBorderSize = document.getElementById("border-size");
    const boxBorderStyle = document.getElementById("border-style");
    const boxBorderColor = document.getElementById("border-color");
    const boxBorderRadius = document.getElementById("border-radius");

    /*------------------margin and padding------------------*/
    const boxMargin = document.getElementById("box-margin");
    const boxPadding = document.getElementById("box-padding");

    /*------------------create Definition------------------*/
    const boxElements = document.getElementById("element-type");

    /*----------------x axis--y axis--box shadow color-------------*/
    const boxShadowColor = document.getElementById("shadow-color");
    const boxShadowX = document.getElementById("shadow-x");
    const boxShadowY = document.getElementById("shadow-y");

    /*--------height,width and background color---------------*/
    const boxWidth = document.getElementById("w-size");
    const boxHeight = document.getElementById("h-size");
    const boxColor = document.getElementById("u-color");

    /*--------------variable for the container----------------*/
    const boxContainer = document.querySelector(".container");

    /*------------------------buttons-------------------------*/
    const addButton = document.getElementById("add-btn");
    const saveButton = document.getElementById("save-btn");
    const deleteButton = document.getElementById("delete-btn");

    if (!textBox || !boxContainer || !addButton || !saveButton || !deleteButton) {
      console.error("Required elements not found");
      return;
    }

    /*-----------------Add Button Function-----------------*/
    //add button
    addButton.addEventListener("click", () => {
      const box = styledBoxCreation();
      boxContainer.appendChild(box);
    });

    //save button
    saveButton.addEventListener("click", () => {
      localStorage.setItem("boxKey", boxContainer.innerHTML);
    });

    // Load box from local storage if available
    if (localStorage.getItem("boxKey")) {
      boxContainer.innerHTML = localStorage.getItem("boxKey");
    }

    const styledBoxCreation = () => {
      const box = document.createElement(boxElements.value);
      box.textContent = textBox.value;
      box.style.color = textColor.value;
      box.style.fontSize = textSize.value + "px";
      box.style.width = boxWidth.value + "px";
      box.style.height = boxHeight.value + "px";
      box.style.borderStyle = boxBorderStyle.value;
      box.style.borderColor = boxBorderColor.value;
      box.style.borderRadius = boxBorderRadius.value + "px";
      box.style.borderWidth = boxBorderSize.value + "px";
      box.style.margin = boxMargin.value + "px";
      box.style.padding = boxPadding.value + "px";
      box.style.boxShadow = `${boxShadowX.value}px ${boxShadowY.value}px ${boxShadowColor.value}`;
      box.style.backgroundColor = boxColor.value;

      return box;
    }

    // Reset all input fields
    const resetAllInputs = () => {
      // Reset text inputs
      if(textBox) textBox.value = "";
      
      // Reset color pickers to default colors
      if(textColor) textColor.value = "#000000";
      if(boxBorderColor) boxBorderColor.value = "#000000";
      if(boxShadowColor) boxShadowColor.value = "#000000";
      if(boxColor) boxColor.value = "#ffffff";
      
      // Reset numeric inputs
      if(textSize) textSize.value = "16";
      if(boxBorderSize) boxBorderSize.value = "1";
      if(boxBorderRadius) boxBorderRadius.value = "0";
      if(boxMargin) boxMargin.value = "0";
      if(boxPadding) boxPadding.value = "0";
      if(boxShadowX) boxShadowX.value = "0";
      if(boxShadowY) boxShadowY.value = "0";
      if(boxWidth) boxWidth.value = "100";
      if(boxHeight) boxHeight.value = "100";
      
      // Reset select dropdowns
      if(boxBorderStyle) boxBorderStyle.value = "solid";
      if(boxElements) boxElements.value = "div";
    };

    //delete button
    deleteButton.addEventListener('click', () => {
      localStorage.clear();
      boxContainer.innerHTML = '';
      resetAllInputs(); // Reset all inputs when delete button is clicked
    });
  }
});