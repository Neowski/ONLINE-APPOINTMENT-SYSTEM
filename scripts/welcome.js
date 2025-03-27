function removePlaceholder(selectElement) {
  if (selectElement.selectedIndex === 0) {
      selectElement.style.color = "gray";
  } else {
      selectElement.style.color = "black";
  }
}
