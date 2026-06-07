document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const commentModal = document.getElementById('commentModal');
  const editProfileModal = document.getElementById('editProfileModal');
  const backdrop = document.getElementById('modalBackdrop');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.main-nav');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    backdrop.style.visibility = 'visible';
    backdrop.style.opacity = '1';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    backdrop.style.opacity = '0';
    backdrop.style.visibility = 'hidden';
  };

  const closeAllModals = () => {
    document.querySelectorAll('.modal.show').forEach((modal) => modal.classList.remove('show'));
    backdrop.style.opacity = '0';
    backdrop.style.visibility = 'hidden';
  };

  const setMenuOpen = (open) => {
    nav?.classList.toggle('show', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    if (menuToggle) menuToggle.textContent = open ? '✕' : '☰';
  };

  loginBtn?.addEventListener('click', () => openModal(loginModal));
  registerBtn?.addEventListener('click', () => openModal(registerModal));
  document.querySelectorAll('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = document.getElementById(button.dataset.openModal || 'registerModal');
      openModal(modal);
    });
  });
  backdrop?.addEventListener('click', closeAllModals);
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  menuToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuOpen(!nav?.classList.contains('show'));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!nav?.contains(target) && !menuToggle?.contains(target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) setMenuOpen(false);
  });

  document.querySelectorAll('.feed-card .share, .icon.share').forEach((button) => {
    button.addEventListener('click', async () => {
      const card = button.closest('.feed-card') || button.closest('.card');
      if (!card) return;
      const text = card.querySelector('h2, p')?.textContent.trim() || 'Swahili_web quote';
      const shareData = { title: 'Swahili_web', text, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else await navigator.clipboard.writeText(`${text} - ${window.location.href}`);
        alert('Quote copied to clipboard');
      } catch (error) {
        console.log('Share failed', error);
      }
    });
  });

  document.querySelectorAll('.card-item .like, .feed-card .like').forEach((button) => {
    button.addEventListener('click', () => {
      const currentCount = Number(button.dataset.count || button.querySelector('.count')?.textContent || 0);
      const isLiked = button.classList.contains('liked');
      const count = isLiked ? currentCount - 1 : currentCount + 1;
      button.dataset.count = count.toString();
      button.classList.toggle('liked');
      button.innerHTML = `${isLiked ? '♡' : '♥'} <span class="count">${count}</span>`;
    });
  });

  const sampleComments = {
    'card-1': [
      { name: 'Amina', text: 'Hii methali inabeba uzito mkubwa sana.', time: '1h ago' },
      { name: 'Juma', text: 'Inaonyesha umuhimu wa kusikiliza wazee.', time: '2h ago' }
    ],
    'card-2': [
      { name: 'Muna', text: 'Ninaipenda misemo hii kwa muziki wa maisha.', time: '30 min ago' }
    ],
    'card-3': [
      { name: 'Salma', text: 'Nukuu nzuri kwa wale wanaosoma Imani.', time: '3h ago' }
    ],
    'card-4': [
      { name: 'Hassan', text: 'Elimu inayohusisha tamaduni ni ya thamani.', time: '4h ago' }
    ],
    'card-5': [
      { name: 'Njeri', text: 'Hadithi ya jadi kwa kweli ni mali ya taifa.', time: '12 min ago' }
    ],
    'card-6': [
      { name: 'Baraka', text: 'Mipaka ya historia hii ni ya kuvutia.', time: '45 min ago' }
    ],
    'card-7': [
      { name: 'Imani', text: 'Nyakati za zamani zinafunua hekima katika methali.', time: '2d ago' }
    ],
    'card-8': [
      { name: 'Salim', text: 'Hadithi za Bahari ya Hindi zinastahili kusomwa.', time: '5h ago' }
    ],
    'card-9': [
      { name: 'Wema', text: 'Nafsi ya kweli inapata thamani kwa methali za jadi.', time: '1d ago' }
    ],
    'card-10': [
      { name: 'Asha', text: 'Ulimwengu wa kiswahili umejaa kumbukumbu nzuri.', time: '3d ago' }
    ],
    'card-11': [
      { name: 'Tamu', text: 'Makumbusho haya yanachangia urithi wa kizazi.', time: '6h ago' }
    ]
  };

  const commentCardTitle = document.getElementById('commentCardTitle');
  const commentList = document.getElementById('commentList');
  const commentForm = document.getElementById('commentForm');
  let activeCommentCard = null;

  const renderComments = (cardId) => {
    if (!commentList) return;
    const comments = sampleComments[cardId] || [];
    if (!comments.length) {
      commentList.innerHTML = '<div class="comment-item">Hakuna maoni bado. Wewe unaweza kuandika kwanza!</div>';
      return;
    }
    commentList.innerHTML = comments.map((comment) => `
      <div class="comment-item">
        <strong>${comment.name}</strong>
        <p>${comment.text}</p>
        <span>${comment.time}</span>
      </div>
    `).join('');
  };

  const updateCommentDisplay = (card, count) => {
    if (!card) return;
    const buttonCount = card.querySelector('.comment .count');
    const metaCount = card.querySelector('.meta-comments');
    const commentButton = card.querySelector('.comment');
    if (buttonCount) buttonCount.textContent = count.toString();
    if (metaCount) metaCount.textContent = `${count} comments`;
    if (commentButton) commentButton.dataset.count = count.toString();
  };

  document.querySelectorAll('.comment[data-comment]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.card-item');
      if (!card || !commentModal) return;
      activeCommentCard = card.dataset.cardid || '';
      commentCardTitle.textContent = card.querySelector('h2')?.textContent || 'Comments';
      renderComments(activeCommentCard);
      openModal(commentModal);
    });
  });

  commentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const textarea = commentForm.querySelector('textarea');
    const value = textarea?.value.trim();
    if (!value || !activeCommentCard) return;
    sampleComments[activeCommentCard] = sampleComments[activeCommentCard] || [];
    sampleComments[activeCommentCard].push({ name: 'Mtumiaji', text: value, time: 'Sasa hivi' });
    renderComments(activeCommentCard);
    const card = document.querySelector(`[data-cardid="${activeCommentCard}"]`);
    if (card) updateCommentDisplay(card, sampleComments[activeCommentCard].length);
    if (textarea) textarea.value = '';
  });

  const searchInput = document.querySelector('.search-panel input[type="search"]');
  const filterTags = document.querySelectorAll('.tag-list .tag');
  let currentFilter = 'all';

  const applySearchAndFilter = () => {
    const searchText = searchInput?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('.main-feed .card-item');
    cards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const cardCategory = card.dataset.category;
      const matchesSearch = searchText === '' || cardText.includes(searchText);
      const matchesFilter = currentFilter === 'all' || cardCategory === currentFilter;
      card.style.display = matchesSearch && matchesFilter ? 'grid' : 'none';
    });
  };

  searchInput?.addEventListener('input', applySearchAndFilter);

  filterTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const filter = tag.dataset.filter || 'all';
      tag.parentElement?.querySelectorAll('.tag').forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      currentFilter = filter;
      applySearchAndFilter();
    });
  });

  const profileTabs = document.querySelectorAll('.profile-tabs .tag');
  const profileMainFeed = document.getElementById('profileMainFeed');
  const profileTabPanel = document.getElementById('profileTabPanel');
  const profileNameEl = document.getElementById('profileName');
  const profileBioEl = document.getElementById('profileBio');
  const profileUsernameEl = document.getElementById('profileUsername');
  const profileAvatarEl = document.getElementById('profileAvatar');
  const profilePostCountEl = document.getElementById('profilePostCount');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const sidebarEditBtn = document.getElementById('profileSidebarEditBtn');
  const editProfileForm = document.getElementById('editProfileForm');
  const profileFullNameInput = document.getElementById('profileFullName');
  const profileUsernameInput = document.getElementById('profileUsernameInput');
  const profileBioInput = document.getElementById('profileBioInput');
  const profilePictureInput = document.getElementById('profilePictureInput');
  const editProfileMessage = document.getElementById('editProfileMessage');

  const myPosts = [
    { title: 'Mafundisho ya methali ya leo', blurb: 'Hekima ya jamii inafundisha uvumilivu na usikivu kwa watu wa karibu.', likes: 77, shares: 18, image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80', tag: 'Trending' },
    { title: 'Kila neno lina uzito', blurb: 'Nukuu za kifahari huwa na maana ya muda mrefu kwa jamii.', likes: 55, shares: 12, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', tag: 'Wisdom' },
    { title: 'Uislamu na adabu', blurb: 'Maisha bora hujengwa kwa tabia njema, heshima na nafasi ya kujifunza.', likes: 64, shares: 14, image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80', tag: 'Culture' }
  ];
  const savedPosts = [
    { title: 'Methali za wazee', blurb: 'Hii ni safu ya maneno ambayo yanatufundisha kutafakari maisha.', likes: 120, shares: 32, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', tag: 'Saved' },
    { title: 'Kila hatua inahitaji maamuzi', blurb: 'Tumia busara kabla ya hatua ya haraka.', likes: 89, shares: 17, image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80', tag: 'Focus' }
  ];
  const likedPosts = [
    { title: 'Nukuu za hekima', blurb: 'Sikio la taaluma na moyo wa usafi hutengeneza jamii yenye nguvu.', likes: 156, shares: 41, image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80', tag: 'Liked' },
    { title: 'Kizazi cha Kiswahili', blurb: 'Tunahifadhi utamaduni kupitia hadithi, methali na lugha.', likes: 200, shares: 55, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', tag: 'Heritage' }
  ];

  const renderPostCards = (posts) => posts.map((post) => `
    <article class="profile-post-card">
      <div class="profile-post-media" style="background-image:linear-gradient(rgba(8,15,23,.35),rgba(8,15,23,.35)),url('${post.image}')">${post.tag}</div>
      <div class="profile-post-body">
        <h3>${post.title}</h3>
        <p>${post.blurb}</p>
      </div>
      <div class="profile-post-meta">
        <span class="profile-post-chip">❤ ${post.likes}</span>
        <span>↗ ${post.shares} shares</span>
      </div>
    </article>
  `).join('');

  const renderProfilePanel = (tabName) => {
    if (!profileTabPanel) return;

    if (tabName === 'Settings') {
      profileTabPanel.innerHTML = `
        <div class="profile-settings-grid">
          <article class="profile-setting-card">
            <h3>Edit Profile</h3>
            <p>Update your display name, bio, and profile image in one place.</p>
            <button class="btn btn-primary" type="button" id="settingsEditProfileBtn">Open editor</button>
          </article>
          <article class="profile-setting-card">
            <h3>Change Password</h3>
            <p>Keep your account secure with a stronger password.</p>
            <button class="btn btn-ghost" type="button">Reset password</button>
          </article>
          <article class="profile-setting-card">
            <h3>Notification Settings</h3>
            <p>Choose how often you want updates from Swahili_web.</p>
            <div class="toggle-row"><span>Push alerts</span><label class="switch"><input type="checkbox" checked><span class="slider"></span></label></div>
            <div class="toggle-row"><span>Email digest</span><label class="switch"><input type="checkbox"><span class="slider"></span></label></div>
          </article>
          <article class="profile-setting-card">
            <h3>Privacy Settings</h3>
            <p>Control who can view your profile and content.</p>
            <select class="profile-select"><option>Public profile</option><option>Private profile</option><option>Followers only</option></select>
          </article>
          <article class="profile-setting-card">
            <h3>Dark Mode</h3>
            <p>Switch the interface to a darker palette for late-night reading.</p>
            <div class="toggle-row"><span>Enable dark mode</span><label class="switch"><input type="checkbox" id="profileDarkToggle"><span class="slider"></span></label></div>
          </article>
          <article class="profile-setting-card">
            <h3>Language</h3>
            <p>Choose the language used in your dashboard.</p>
            <select class="profile-select"><option>Kiswahili</option><option>English</option><option>Français</option></select>
          </article>
        </div>
        <article class="profile-setting-card">
          <h3>Account actions</h3>
          <p>Use these controls to manage your current session.</p>
          <div class="profile-actions">
            <button class="btn btn-ghost" type="button" id="logoutBtn">Logout</button>
            <button class="btn btn-primary" type="button">Save changes</button>
          </div>
        </article>
      `;
      document.getElementById('settingsEditProfileBtn')?.addEventListener('click', () => openModal(editProfileModal));
      const darkToggle = document.getElementById('profileDarkToggle');
      if (darkToggle) {
        darkToggle.checked = document.body.classList.contains('dark-mode');
        darkToggle.addEventListener('change', (event) => {
          document.body.classList.toggle('dark-mode', event.target.checked);
          localStorage.setItem('sw-theme', event.target.checked ? 'dark' : 'light');
        });
      }
      return;
    }

    const posts = tabName === 'Saved' ? savedPosts : tabName === 'Likes' ? likedPosts : myPosts;
    if (!posts.length) {
      profileTabPanel.innerHTML = '<div class="profile-empty">Hakuna maudhui yaliyohifadhiwa hapa sasa. Weka alama kwenye picha unazopenda ili kuona orodha yako hapa.</div>';
      return;
    }

    profileTabPanel.innerHTML = `
      <div class="profile-post-grid">${renderPostCards(posts)}</div>
      <div class="profile-empty">Demo data inatumika hadi backend ijao. Karibu kuongeza picha, likes, na shares kutoka kwa upload yako ya kweli.</div>
    `;
  };

  profileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab || tab.textContent.trim();
      profileTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderProfilePanel(tabName);
    });
  });

  if (profileTabs.length) {
    profileTabs[0].click();
    if (profilePostCountEl) profilePostCountEl.textContent = '12';
  }

  editProfileBtn?.addEventListener('click', () => openModal(editProfileModal));
  sidebarEditBtn?.addEventListener('click', () => openModal(editProfileModal));

  editProfileForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = profileFullNameInput?.value.trim() || 'Abdu Hamid';
    const username = profileUsernameInput?.value.trim() || 'abdu_h';
    const bio = profileBioInput?.value.trim() || 'Mpenda Hekima, Uislamu na Maarifa ya Kiswahili.';
    profileNameEl && (profileNameEl.textContent = name);
    profileUsernameEl && (profileUsernameEl.textContent = `@${username}`);
    profileBioEl && (profileBioEl.textContent = bio);
    const file = profilePictureInput?.files?.[0];
    if (file && profileAvatarEl) {
      const reader = new FileReader();
      reader.onload = () => {
        profileAvatarEl.style.backgroundImage = `url(${reader.result})`;
        profileAvatarEl.textContent = '';
      };
      reader.readAsDataURL(file);
    }
    if (editProfileMessage) {
      editProfileMessage.textContent = 'Profaili imebadilishwa kwa mafanikio.';
      editProfileMessage.className = 'form-message success';
    }
    setTimeout(() => {
      closeModal(editProfileModal);
    }, 800);
  });

  const uploadForm = document.getElementById('uploadForm');
  const uploadFormMessage = document.getElementById('uploadFormMessage');

  const showFormMessage = (element, message, status) => {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${status}`;
  };

  uploadForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('uploadTitle')?.value.trim();
    const category = document.getElementById('uploadCategory')?.value;
    const text = document.getElementById('uploadText')?.value.trim();
    if (!title) {
      showFormMessage(uploadFormMessage, 'Tafadhali andika kichwa cha maudhui.', 'error');
      return;
    }
    if (!category) {
      showFormMessage(uploadFormMessage, 'Chagua kategoria ya maudhui.', 'error');
      return;
    }
    if (!text) {
      showFormMessage(uploadFormMessage, 'Tafadhali andika maudhui kabla ya kutuma.', 'error');
      return;
    }
    showFormMessage(uploadFormMessage, 'Maudhui yako yamewasilishwa kwa mafanikio!', 'success');
    uploadForm.reset();
  });

  // Initialize theme from storage
  const applyTheme = (theme) => {
    if (theme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  };
  const stored = localStorage.getItem('sw-theme') || 'light';
  applyTheme(stored);

  // Delegate dark mode toggle and logout from settings
  document.addEventListener('change', (e) => {
    const target = e.target;
    if (target && target.id === 'darkmode') {
      const enabled = target.checked;
      localStorage.setItem('sw-theme', enabled ? 'dark' : 'light');
      applyTheme(enabled ? 'dark' : 'light');
    }
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.id === 'logoutBtn') {
      // demo logout
      if (confirm('Una hakika unataka kutoka?')) {
        alert('Umetoka (demo)');
        // In real app: perform signout and redirect
      }
    }
  });

  // Ensure learning cards have top icon/title wrapper for consistency
  const learningCards = document.querySelectorAll('.learning-card');
  const createIconFor = (category) => {
    switch ((category||'').toLowerCase()) {
      case 'misemo':
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 6h-18v9h4v4l5-4h9z"/></svg>';
      case 'nukuu':
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 100 14 7 7 0 000-14z"/></svg>';
      case 'elimu':
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l8 4-8 4-8-4 8-4zM4 10v6l8 4 8-4v-6"/></svg>';
      case 'historia':
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>';
      default:
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h10v14H6z"/></svg>';
    }
  };
  learningCards.forEach((card) => {
    if (!card.querySelector('.top')) {
      const cat = card.dataset.category || '';
      const wrapper = document.createElement('div');
      wrapper.className = 'top';
      const iconWrap = document.createElement('div');
      iconWrap.className = 'learning-icon';
      iconWrap.setAttribute('aria-hidden', 'true');
      iconWrap.innerHTML = createIconFor(cat);
      const titleWrap = document.createElement('div');
      titleWrap.className = 'title';
      const h3 = card.querySelector('h3') || card.querySelector('h2') || document.createElement('h3');
      titleWrap.appendChild(h3);
      wrapper.appendChild(iconWrap);
      wrapper.appendChild(titleWrap);
      card.insertBefore(wrapper, card.firstChild);
    }
  });

  document.getElementById('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Logged in successfully (demo)');
    closeModal(loginModal);
  });

  document.getElementById('registerForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Account created successfully (demo)');
    closeModal(registerModal);
  });
});
