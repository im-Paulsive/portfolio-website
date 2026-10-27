document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalTech = document.getElementById("modalTech");
  const modalCategory = document.getElementById("modalCategory");

  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Scroll reveals and skill bar animation
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll(".reveal, .skill-row").forEach(el => revealObserver.observe(el));

  // Interactive project details
  const projectData = {
    heart: {
      category: "PROJECT 01 / MACHINE LEARNING",
      title: "Heart Disease Risk Prediction",
      description: "A predictive modelling project comparing Logistic Regression, XGBoost, and deep learning approaches for heart disease risk estimation. The workflow includes data preparation, feature engineering, model training, and evaluation.",
      tech: ["Python", "Pandas", "Scikit-learn", "XGBoost", "TensorFlow"]
    },
    news: {
      category: "PROJECT 02 / NATURAL LANGUAGE PROCESSING",
      title: "Fake News Detection System",
      description: "A text-classification microproject that represents news with TF-IDF features and compares Naive Bayes and Decision Tree approaches to classify articles as fake or real.",
      tech: ["Python", "TF-IDF", "Naive Bayes", "Decision Tree", "Scikit-learn"]
    },
    attendance: {
      category: "PROJECT 03 / COMPUTER VISION",
      title: "AI Classroom System",
      description: "A classroom automation prototype combining face recognition, ID-card detection, and attention-related signals. The project explores how computer vision can support attendance workflows.",
      tech: ["Python", "OpenCV", "YOLOv8", "MediaPipe", "Flask"]
    }
  };

  function openModal(key) {
    const project = projectData[key];
    if (!project) return;
    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTech.replaceChildren();
    project.tech.forEach(tech => {
      const tag = document.createElement("span");
      tag.textContent = tech;
      modalTech.appendChild(tag);
    });
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }
  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-open-project]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.openProject));
  });
  document.querySelectorAll(".project-card[data-project]").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("button, a")) return;
      openModal(card.dataset.project);
    });
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });

  // Soft cursor glow and card tilt on desktop
  const glow = document.querySelector(".cursor-glow");
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = event.clientX + "px";
      glow.style.top = event.clientY + "px";
    }, { passive: true });

    document.querySelectorAll(".tilt-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".magnetic").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
      });
      button.addEventListener("pointerleave", () => button.style.transform = "");
    });
  }

  // Three.js ambient 3D particle field. The site remains usable if the CDN is unavailable.
  const canvas = document.getElementById("scene");
  if (!reduceMotion && window.THREE && canvas) {
    try {
      const THREE = window.THREE;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 14;

      const count = window.innerWidth < 700 ? 550 : 1100;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 32;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
        const mint = Math.random() > 0.25;
        colors[i * 3] = mint ? 0.58 : 0.62;
        colors[i * 3 + 1] = mint ? 1 : 0.57;
        colors[i * 3 + 2] = mint ? 0.78 : 1;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: 0.035, vertexColors: true, transparent: true, opacity: 0.72,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const wireGeometry = new THREE.IcosahedronGeometry(5.2, 2);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x9cffd1, wireframe: true, transparent: true, opacity: 0.035
      });
      const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
      wireSphere.position.set(5.8, 0.4, -4);
      scene.add(wireSphere);

      let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
      window.addEventListener("pointermove", e => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.55;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.35;
      }, { passive: true });
      function animate() {
        requestAnimationFrame(animate);
        pointerX += (targetX - pointerX) * 0.025;
        pointerY += (targetY - pointerY) * 0.025;
        particles.rotation.y += 0.00035;
        particles.rotation.x += 0.00012;
        particles.rotation.y += pointerX * 0.0008;
        particles.rotation.x += pointerY * 0.0008;
        wireSphere.rotation.x += 0.0005;
        wireSphere.rotation.y -= 0.0007;
        camera.position.x += (pointerX * 1.8 - camera.position.x) * 0.015;
        camera.position.y += (-pointerY * 1.4 - camera.position.y) * 0.015;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      });
    } catch (error) {
      console.warn("3D background could not be initialized.", error);
    }
  }
});
