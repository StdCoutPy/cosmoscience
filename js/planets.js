function initPlanet(id){
    const planet=document.getElementById(id);
    // Добавляем эффект освещения через CSS программно
    planet.style.boxShadow = "inset -20px -20px 50px #000, 0 0 40px rgba(106, 0, 255, 0.3)";

    let isDragging=false,lastX,lastY,rotX=0,rotY=0;
    planet.addEventListener('mousedown',e=>{
        isDragging=true; lastX=e.clientX; lastY=e.clientY; planet.style.cursor='grabbing';
    });
    document.addEventListener('mouseup',()=>{isDragging=false; planet.style.cursor='grab';});
    document.addEventListener('mousemove',e=>{
        if(!isDragging) return;
        const dx=e.clientX-lastX, dy=e.clientY-lastY;
        rotY+=dx*0.5; rotX-=dy*0.5;
        planet.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        lastX=e.clientX; lastY=e.clientY;
    });
    function animate(){ if(!isDragging){rotY+=0.2; planet.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;} requestAnimationFrame(animate);}
    animate();
}
