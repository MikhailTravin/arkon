const AW = {};

$.validator.addMethod('mobileRu', function (phone_number, element) {
  const ruPhone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
  return this.optional(element) || ruPhone_number.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhone_number);
}, "Please specify a valid mobile number.");

AW.modal = new HystModal({
  linkAttributeName: "data-hystmodal",
  closeOnOverlay: false,
  afterClose: (modal) => {
    // switch ($(modal.element).attr('id')) {
    //   case 'modalConfirm': {
    //     $('#modalConfirm [data-confirm-ok]').off('click');
    //     $('#modalConfirm [data-confirm-cancel]').off('click');
    //     break;
    //   }

    //   case 'modalVacancy': {
    //     AW.resetForm($('#modalVacancy form'));
    //     break;
    //   }
    // }
  },
});

AW.FANCYBOX_DEFAULTS = {
  hideScrollbar: false,
  Hash: false,
  Thumbs: {
    type: 'classic',
  },
  Toolbar: {
    display: {
      left: ['infobar'],
      middle: [
        'zoomIn',
        'zoomOut',
      ],
      right: ['close'],
    },
  },
}

AW.initMask = function ($field) {
  const type = $field.attr('data-mask');
  let mask;
  switch (type) {
    case 'phone':
      mask = IMask($field[0], {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        placeholderChar: '_'
      });
      $field.on('focus', () => {
        if (mask.value === '') mask.value = '+7 ';
      });
      break;
  }
};

AW.StepCounter = class {
  /**
   * Constructor function for creating an instance of the class.
   *
   * @param {jQuery} $element - The jQuery element to bind the functionality to.
   * @param {function} callback - The callback function to be executed on value change.
   * @throws {Error} Throws an error if the element is not found.
   * @return {void}
   */
  constructor($element, callback) {
    if (!$element) throw Error('Element not found!');
    this.element = $element;
    this.callback = callback || null;
    this.btnIncreaseElement = $element.find('[data-stepcounter="+"]');
    this.btnDecreaseElement = $element.find('[data-stepcounter="-"]');
    this.fieldElement = $element.find('[data-stepcounter-input]');
    this.valueElement = $element.find('[data-stepcounter-value]');

    this.maxValue = Number(this.fieldElement.attr('max')) || 10000;
    this.minValue = Number(this.fieldElement.attr('min')) || 0;
    this.step = Number(this.fieldElement.attr('step')) || 1;
    this.value = Number(this.fieldElement.val());

    this.btnIncreaseElement.on('click', this.handleBtnIncrease.bind(this));
    this.btnDecreaseElement.on('click', this.handleBtnDecrease.bind(this));

    this.validateValue(this.value);
  }

  /**
   * Handles the click event of the increase button.
   *
   * @param {Event} event - The click event object.
   * @return {undefined} This function does not return a value.
   */
  handleBtnIncrease(event) {
    event.preventDefault();
    this.updateValue(this.value + this.step);
  }

  /**
   * Handles the click event of the decrease button.
   *
   * @param {Event} event - The click event object.
   * @return {undefined} This function does not return a value.
   */
  handleBtnDecrease(event) {
    event.preventDefault();
    this.updateValue(this.value - this.step);
  }

  /**
   * Updates the value of the object and renders it.
   *
   * @param {number} newValue - The new value to be assigned.
   * @param {boolean} noValidate - Flag indicating whether the value should be validated. Defaults to false.
   */
  updateValue(newValue, noValidate = false) {
    const validatedValue = noValidate ? newValue : this.validateValue(newValue);
    this.value = validatedValue;
    this.renderValue(this.value);
    if (this.callback) {
      this.callback(this.value);
    }
  }

  /**
   * Disables a button based on the given parameter.
   *
   * @param {string} btn - The button to enable. It can be either 'increase' or 'decrease'.
   */
  disableBtn(btn) {
    if (btn === 'increase') {
      this.btnIncreaseElement.attr('disabled', true);
    }
    if (btn === 'decrease') {
      this.btnDecreaseElement.attr('disabled', true);
    }
  }

  /**
   * Enables a button based on the given parameter.
   *
   * @param {string} btn - The button to enable. It can be either 'increase' or 'decrease'.
   */
  enableBtn(btn) {
    if (btn === 'increase') {
      this.btnIncreaseElement.attr('disabled', false);
    }
    if (btn === 'decrease') {
      this.btnDecreaseElement.attr('disabled', false);
    }
  }

  /**
   * Validates the given value based on the minimum and maximum values.
   *
   * @param {number} value - The value to be validated.
   * @return {number} The validated value within the specified range.
   */
  validateValue(value) {
    let validatedValue;
    if (value >= this.maxValue) {
      validatedValue = this.maxValue;
      this.disableBtn('increase');
    } else if (value <= this.minValue) {
      validatedValue = this.minValue;
      this.disableBtn('decrease');
    } else {
      validatedValue = value;
      this.enableBtn('increase');
      this.enableBtn('decrease');
    }
    return validatedValue;
  }

  /**
   * Renders the value by updating the field element's value
   * and the value element's text.
   *
   * @param {Number} value - The value to be rendered.
   */
  renderValue(value) {
    this.fieldElement.val(value);
    this.valueElement.text(value);
  }

  /**
   * Retrieves the current value.
   *
   * @return {number} The current value.
   */
  getCurrentValue() {
    return this.value;
  }

  /**
   * This function destroys the event listeners for the button elements.
   */
  destroy() {
    this.btnIncreaseElement.off('click', this.handleBtnIncrease.bind(this));
    this.btnDecreaseElement.off('click', this.handleBtnDecrease.bind(this));
  }
};

AW.validateForm = function ($el) {
  if ($el.length === 0) return;

  const validator = $el.validate({
    ignore: [],
    errorClass: 'form-group1__error',
    errorPlacement: function (error, element) {
      const $parent = $(element).closest('.form-group1');
      $parent.append(error);
    },
    highlight: function (element) {
      const $parent = $(element).closest('.form-group1');
      $parent.addClass('form-group1_error');
    },
    unhighlight: function (element) {
      const $parent = $(element).closest('.form-group1');
      $parent.removeClass('form-group1_error');
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      const trigger = $el.attr('data-onsubmit-trigger');
      if (trigger) {
        $(document).trigger(trigger, { event, form });
      } else {
        form.submit();
      }
    }
  });

  $el.find('.field-input1, .checkbox__input, select').each(function () {
    if ($(this).is(':required')) {
      $(this).rules('add', {
        required: true,
        messages: {
          required: 'Заполните это поле',
        }
      });
    }

    if ($(this).attr('data-type') === 'phone') {
      $(this).rules('add', {
        mobileRu: true,
        messages: {
          mobileRu: 'Неверный формат',
        }
      });
    }

    if ($(this).attr('data-type') === 'email') {
      $(this).rules('add', {
        email: true,
        messages: {
          email: 'Неверный формат',
        }
      });
    }

    if ($(this).attr('minlength') !== '') {
      $(this).rules('add', {
        minlength: $(this).attr('minlength'),
        messages: {
          minlength: `Минимум ${$(this).attr('minlength')} символов`,
        }
      });
    }
  });

  // Переключение видимости пароля
  $el.on('click', '.form-group1__icon.toggle-password', function (e) {
    e.preventDefault();

    const $icon = $(this);
    const $parent = $icon.closest('.form-group1');
    const $input = $parent.find('input[data-type="password"]');

    if ($input.length > 0) {
      const isPassword = $input.attr('type') === 'password';
      $input.attr('type', isPassword ? 'text' : 'password');

      // Переключаем отображение иконок
      $parent.find('.form-group1__icon').each(function () {
        $(this).toggleClass('hidden');
      });
    }
  });

  return validator;
}

AW.initSliderPublications = function ($el) {
  new Swiper($el[0], {
    loop: false,
    spaceBetween: 10,
    slidesPerView: 'auto',
    speed: 200,
    breakpoints: {
      900: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });
}

AW.initSliderRecommend = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: false,
    spaceBetween: 10,
    slidesPerView: 1,
    speed: 200,
    breakpoints: {
      600: {
        slidesPerView: 2,
        spaceBetween: 15
      },
      900: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      1300: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1400: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
  });
}

AW.initSliderTeasers1 = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 500,
    effect: 'fade',
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    on: {
      init: function () {
        $('.block-teaser1').removeClass('preload');
      },
    },
  });
}

AW.initSliderTeasers2 = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
  });
}

AW.initSliderTeasers3 = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 15
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 30
      }
    }
  });


}

AW.initSliderGalleryShops = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      1300: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });


}

AW.initSliderGalleryMedia = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    breakpoints: {
      650: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      1300: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });


}

AW.initSliderOtherShops = function ($el) {
  const $slider = $el;
  const $topBlock = $el.closest('.block-other-shops__content').find('.block-other-shops__top');
  const $navs = $el.find('.swiper-navs');
  const $navNext = $navs.find('.swiper-nav_next');
  const $navPrev = $navs.find('.swiper-nav_prev');

  function moveNavigation() {
    if (window.innerWidth >= 1100) {
      if (!$navs.parent().is('.block-other-shops__top')) {
        $navs.detach().appendTo($topBlock);
      }
    } else {
      if (!$navs.parent().is('.block-other-shops__slider')) {
        $navs.detach().appendTo($slider);
      }
    }
  }

  const swiper = new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    breakpoints: {
      480: {
        slidesPerView: 2,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1100: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    on: {
      init: function () {
        moveNavigation();
      }
    }
  });

  $(window).on('resize', function () {
    moveNavigation();

    swiper.update();
  });

  moveNavigation();
}

AW.initSliderRecommend2 = function ($el) {
  const $slider = $el;
  const $topBlock = $el.closest('.block-recommend-sale').find('.heading-cols1');
  const $navs = $el.find('.swiper-navs');
  const $navNext = $navs.find('.swiper-nav_next');
  const $navPrev = $navs.find('.swiper-nav_prev');

  function moveNavigation() {
    if (window.innerWidth >= 1100) {
      if (!$navs.parent().is('.heading-cols1')) {
        $navs.detach().appendTo($topBlock);
      }
    } else {
      if (!$navs.parent().is('.swiper-recommend2')) {
        $navs.detach().appendTo($slider);
      }
    }
  }

  const swiper = new Swiper($el[0], {
    loop: true,
    spaceBetween: 8,
    slidesPerView: 2,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    breakpoints: {
      480: {
        slidesPerView: 2,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    on: {
      init: function () {
        moveNavigation();
      }
    }
  });

  $(window).on('resize', function () {
    moveNavigation();
    swiper.update();
  });

  moveNavigation();
};

AW.initSliderPublicationsOther = function ($el) {
  const $slider = $el;
  const $topBlock = $el.closest('.block-publications-other').find('.heading-cols1');
  const $navs = $el.find('.swiper-navs');
  const $navNext = $navs.find('.swiper-nav_next');
  const $navPrev = $navs.find('.swiper-nav_prev');

  function moveNavigation() {
    if (window.innerWidth >= 1100) {
      if (!$navs.parent().is('.heading-cols1')) {
        $navs.detach().appendTo($topBlock);
      }
    } else {
      if (!$navs.parent().is('.swiper-publications')) {
        $navs.detach().appendTo($slider);
      }
    }
  }

  const swiper = new Swiper($el[0], {
    loop: false,
    spaceBetween: 10,
    slidesPerView: 'auto',
    speed: 200,
    breakpoints: {
      900: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    on: {
      init: function () {
        moveNavigation();
      }
    }
  });

  $(window).on('resize', function () {
    moveNavigation();
    swiper.update();
  });

  moveNavigation();
};

$(document).ready(() => {



  let debounce = null;

  Fancybox.defaults.Hash = false;
  Fancybox.defaults.l10n = {
    CLOSE: 'Закрыть',
    NEXT: 'Следующий',
    PREV: 'Предыдущий',
    MODAL: 'Вы можете закрыть это окно нажав на клавишу ESC',
    ERROR: 'Что-то пошло не так, пожалуйста, попробуйте еще раз',
    IMAGE_ERROR: 'Изображение не найдено',
    ELEMENT_NOT_FOUND: 'HTML элемент не найден',
    AJAX_NOT_FOUND: 'Ошибка загрузки AJAX : Не найдено',
    AJAX_FORBIDDEN: 'Ошибка загрузки AJAX : Нет доступа',
    IFRAME_ERROR: 'Ошибка загрузки страницы',
    ZOOMIN: 'Увеличить',
    ZOOMOUT: 'Уменьшить',
    TOGGLE_THUMBS: 'Галерея',
    TOGGLE_SLIDESHOW: 'Слайдшоу',
    TOGGLE_FULLSCREEN: 'На весь экран',
    DOWNLOAD: 'Скачать'
  };

  Fancybox.bind('[data-fancybox]', AW.FANCYBOX_DEFAULTS);

  // Этот хак помогает избежать прыжков анимации при загрузке страницы
  $('body').removeClass('preload');

  $('.header__btn-catalog .btn-catalog').on('mouseenter', function () {
    $('.header__btn-catalog').addClass('active');
  });

  $('.header__btn-catalog').on('mouseleave', function () {
    $('.header__btn-catalog').removeClass('active');
  });

  $('.header__btn-burger .header__btn1').on('click', function () {
    $('.header__btn-burger').toggleClass('active');
    $('.header').toggleClass('submenu-active');
  });

  $('.header__menu-chevron').on('click', function () {
    $(this).closest('li').addClass('active');
  });

  $('.header__menu-back').on('click', function () {
    $(this).closest('li').removeClass('active');
    $(this).closest('.catalog-mobile').removeClass('active');
  });

  $('.catalog-mobile__btn').on('click', function () {
    $(this).closest('.catalog-mobile').addClass('active');
  });

  tippy('[data-tippy-content]', {
    theme: 'arkon',
    maxWidth: 184,
  });

  $('[data-preview="container"]').on('mouseenter', '[data-preview="item"]', function () {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const $parent = $(this).closest('[data-preview="container"]');
      const $stack = $parent.find('[data-preview="stack"]');
      $parent.find('.photos-preview__nav-item_active').removeClass('photos-preview__nav-item_active');
      $(this).addClass('photos-preview__nav-item_active');
      $stack.find('img:visible').removeAttr('style');
      $stack.find(`img:nth-child(${$(this).index() + 1}`).css('visibility', 'visible');
    }, 150);
  });

  $('.swiper-teasers1').each(function () {
    AW.initSliderTeasers1($(this));
  });

  $('.swiper-teasers2').each(function () {
    AW.initSliderTeasers2($(this));
  });

  $('.swiper-teasers3').each(function () {
    AW.initSliderTeasers3($(this));
  });

  $('.swiper-publications').each(function () {
    AW.initSliderPublications($(this));
  });

  $('.swiper-publications').each(function () {
    AW.initSliderPublicationsOther($(this));
  });



  $('.swiper-recommend').each(function () {
    AW.initSliderRecommend($(this));
  });

  $('.swiper-recommend2').each(function () {
    AW.initSliderRecommend2($(this));
  });

  $('.shops-gallery').each(function () {
    AW.initSliderGalleryShops($(this));
  });

  $('.block-media-detail__slider').each(function () {
    AW.initSliderGalleryMedia($(this));
  });

  $('.block-other-shops__slider').each(function () {
    AW.initSliderOtherShops($(this));
  });



  $('[data-validate]').each(function () {
    AW.validateForm($(this));
  });

  $('[data-mask]').each(function () {
    AW.initMask($(this));
  });

  // $('[data-stepcounter]').each(function() {
  //   new AW.StepCounter($(this));
  // });

  $('[data-select1]').each(function () {
    const selectElement = $(this)[0];
    const hasLocationClass = selectElement.classList.contains('location');

    new TomSelect(selectElement, {
      controlInput: null,
      create: true,
      render: {
        item: function (data, escape) {
          let locationIcon = '';
          if (hasLocationClass) {
            locationIcon = `
            <svg aria-hidden="true" width="16" height="20">
              <use xlink:href="img/sprite.svg#location1"></use>
            </svg>
          `;
          }

          return `
          <div class="item">
            ${locationIcon}
            ${escape(data.text)}
          </div>
        `;
        }
      },
      onInitialize: function () {
        $(this.control).append(`
        <svg aria-hidden="true" width="9" height="16">
          <use xlink:href="img/sprite.svg#chevron1"></use>
        </svg>
      `);
      },
      onDropdownOpen: function () {
        if (!this.wrapper.querySelector('.ts-dropdown-simplebar')) {
          const simplebarDiv = document.createElement('div');
          simplebarDiv.className = 'ts-dropdown-simplebar';
          simplebarDiv.setAttribute('data-simplebar', '');

          while (this.dropdown.firstChild) {
            simplebarDiv.appendChild(this.dropdown.firstChild);
          }

          this.dropdown.appendChild(simplebarDiv);
        }
      }
    });
  });

  // $('[data-expandable-handle]').click(function () {
  //   const $parent = $(this).closest('[data-expandable]');
  //   const $accordion = $(this).closest('[data-container="accordion"]');
  //   if ($parent.attr('data-expandable') === 'collapsed') {
  //     $accordion.find('[data-expandable="expanded"] [data-expandable-clip]').css('overflow', 'hidden');
  //     $accordion.find('[data-expandable="expanded"]').attr('data-expandable', 'collapsed');
  //     $parent.attr('data-expandable', 'expanded');
  //     setTimeout(() => {
  //       // Небольшой костыль для ровной работы экспандера
  //       $parent.find('[data-expandable-clip]').css('overflow', 'visible');
  //     }, 250);
  //   } else {
  //     $parent.find('[data-expandable-clip]').css('overflow', 'hidden');
  //     $parent.attr('data-expandable', 'collapsed');
  //   }
  // });

  // $('body').on('click', function(event) {
  //   if (
  //     $('.dd-header-catalog').hasClass('dd-header-catalog_active')
  //     &&
  //     $(event.target).attr('data-action') !== 'showHeaderCatalog'
  //     &&
  //     $(event.target).closest('[data-action="showHeaderCatalog"]').length === 0
  //     &&
  //     $(event.target).closest('.dd-header-catalog').length === 0
  //     &&
  //     !$(event.target).hasClass('dd-header-catalog')
  //   ) {
  //     hideHeaderCatalog();
  //   }
  // });

  $('body').on('click', '[data-action]', function (event) {
    const alias = $(this).attr('data-action');

    switch (alias) {
      case 'showTab1': {
        if (!$(this).hasClass('btn-corner1_active')) {
          const $container = $(this).closest('[data-container="tab1"]');
          const alias = $(this).attr('data-tab');
          if ($container.length && alias) {
            $container.find('.btn-corner1_active').removeClass('btn-corner1_active');
            $(this).addClass('btn-corner1_active');
            $container.find('[data-tab-content]').each(function () {
              if ($(this).attr('data-tab-content') === alias) {
                $(this).show();
              } else {
                $(this).hide();
              }
            });
          }
        }
        break;
      }
    }
  });

  // $('body').on('input', '[data-action-input]', function(event) {
  //   const alias = $(this).attr('data-action-input');

  //   switch (alias) {
  //     case 'testAction': {

  //       break;
  //     }
  //   }
  // });



});

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              // Инициализируем showmore при открытом спойлере
              setTimeout(() => initShowMoreInSpoller(spollerTitle.nextElementSibling), 10);
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.nextElementSibling.hidden = false;
          }
        }));
      }
    }

    function initShowMoreInSpoller(spollerBody) {
      const showMoreBlocks = spollerBody.querySelectorAll('[data-showmore]');

      showMoreBlocks.forEach(showMoreBlock => {
        const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
        const showMoreButton = showMoreBlock.querySelector('[data-showmore-button]');
        const items = showMoreContent.children;
        const limit = 6; // Показываем 6 элементов

        if (items.length > limit) {
          // 1. Сначала сбросим ограничения, чтобы измерить реальные размеры
          showMoreContent.style.maxHeight = '';
          showMoreContent.style.overflow = '';

          // 2. Ждем следующего фрейма для применения стилей
          setTimeout(() => {
            // 3. Рассчитываем высоту для 6 элементов
            let height = 0;
            const itemHeight = [];

            // Измеряем высоту каждого из первых 6 элементов
            for (let i = 0; i < limit; i++) {
              const item = items[i];
              const styles = getComputedStyle(item);
              const marginTop = parseFloat(styles.marginTop) || 0;
              const marginBottom = parseFloat(styles.marginBottom) || 0;
              itemHeight.push(item.offsetHeight + marginTop + marginBottom);
            }

            // Учитываем промежутки (gap) между элементами
            const gap = parseFloat(getComputedStyle(showMoreContent).gap) || 0;
            height = itemHeight.reduce((sum, h) => sum + h, 0) + (gap * (limit - 1));

            // 4. Применяем рассчитанную высоту
            showMoreContent.style.maxHeight = `${height}px`;
            showMoreContent.style.overflow = 'hidden';
            showMoreButton.hidden = false;

            // 5. Настройка кнопки "Показать еще"
            showMoreButton.addEventListener('click', function (e) {
              e.preventDefault();
              const isExpanded = showMoreContent.style.maxHeight !== `${height}px`;

              if (!isExpanded) {
                showMoreContent.style.maxHeight = `${showMoreContent.scrollHeight}px`;
                showMoreButton.querySelector('span:first-child').hidden = true;
                showMoreButton.querySelector('span:last-child').hidden = false;
              } else {
                showMoreContent.style.maxHeight = `${height}px`;
                showMoreButton.querySelector('span:first-child').hidden = false;
                showMoreButton.querySelector('span:last-child').hidden = true;
              }
            });
          }, 50); // Небольшая задержка для гарантии применения стилей
        } else {
          showMoreButton.hidden = true;
        }
      });
    }

    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("[data-spoller]")) {
        const spollerTitle = el.closest("[data-spoller]");
        const spollerItem = spollerTitle.closest(".spollers__item");
        const spollersBlock = spollerTitle.closest("[data-spollers]");
        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
            hideSpollersBody(spollersBlock);
          }

          spollerTitle.classList.toggle("_spoller-active");
          if (spollerItem) spollerItem.classList.toggle("_spoller-active");

          const contentBlock = spollerTitle.nextElementSibling;
          _slideToggle(contentBlock, spollerSpeed, () => {
            // Инициализируем showonly при открытии спойлера
            if (spollerTitle.classList.contains("_spoller-active")) {
              setTimeout(() => initShowMoreInSpoller(contentBlock), 10);
            }
          });

          e.preventDefault();
        }
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");
            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}
spollers();

//Ползунок
function rangeInit() {
  const ratingSearch = document.querySelector('.filter-catalog-detail__range');
  if (ratingSearch) {
    noUiSlider.create(ratingSearch, {
      start: [5029, 13619],
      connect: true,
      range: {
        'min': [0],
        'max': [550000]
      },
      format: wNumb({
        decimals: 0,
        thousand: ' ',
      }),
    });

    function updateInputWidth(inputElement) {
      const div = document.createElement('div');
      div.style.visibility = 'hidden';
      div.style.position = 'absolute';
      div.style.whiteSpace = 'pre';
      div.style.font = window.getComputedStyle(inputElement).font;
      div.style.padding = window.getComputedStyle(inputElement).padding;
      div.textContent = inputElement.value || inputElement.placeholder;
      document.body.appendChild(div);
      inputElement.style.width = div.offsetWidth + 'px';
      document.body.removeChild(div);
    }

    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');

    priceStart.addEventListener('change', function () {
      ratingSearch.noUiSlider.set([this.value, null]);
    });

    priceEnd.addEventListener('change', function () {
      ratingSearch.noUiSlider.set([null, this.value]);
    });

    priceStart.addEventListener('input', () => updateInputWidth(priceStart));
    priceEnd.addEventListener('input', () => updateInputWidth(priceEnd));

    ratingSearch.noUiSlider.on('update', function (values, handle) {
      var value = values[handle].replace(' ₽', '');

      if (handle) {
        priceEnd.value = value;
        updateInputWidth(priceEnd);
      } else {
        priceStart.value = value;
        updateInputWidth(priceStart);
      }
    });

    updateInputWidth(priceStart);
    updateInputWidth(priceEnd);
  }
}
rangeInit();

// Функция форматирования числа с пробелами
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

//Плавающая кнопка
const filterFloatingButton = document.querySelector(".filter-catalog-detail__floating-btn");
if (filterFloatingButton) {
  const filterContent = document.querySelector(".filter-catalog-detail__content");
  const filterContainer = document.querySelector(".filter-catalog-detail");
  const filterItems = document.querySelectorAll(".filter-catalog-detail__item");
  const activeFilterItems = Array.from(filterItems).slice(1); // пропускаем первый (цена)

  const allInputs = activeFilterItems.flatMap(item => {
    const checkboxes = item.querySelectorAll(".checkbox__input");
    const radios = item.querySelectorAll(".radio__input");
    return [...checkboxes, ...radios];
  });

  filterFloatingButton.style.position = 'absolute';
  filterFloatingButton.style.display = 'none';

  const filterContainerRect = filterContainer.getBoundingClientRect();
  const filterContainerTop = filterContainerRect.top + window.pageYOffset;

  let timeoutId = null;

  function handleInputToggle(input) {
    if (document.documentElement.clientWidth > 1100) {
      if (timeoutId) clearTimeout(timeoutId);

      const inputRect = input.getBoundingClientRect();
      const inputTop = inputRect.top + window.pageYOffset;

      const inputHeight = inputRect.height;
      const buttonHeight = filterFloatingButton.offsetHeight;

      const relativeTop = (inputTop - filterContainerTop) + (inputHeight / 2) - (buttonHeight / 2);

      filterFloatingButton.style.top = Math.max(0, relativeTop) + 'px';
      filterFloatingButton.style.left = filterContainerRect.width + 'px';

      if (input.checked) {
        filterFloatingButton.style.display = 'block';
      } else {
        filterFloatingButton.style.display = 'none';
      }

      timeoutId = setTimeout(() => {
        filterFloatingButton.style.display = 'none';
      }, 10000);
    }
  }

  allInputs.forEach(input => {
    input.addEventListener("change", () => {
      handleInputToggle(input);
    });
  });

  let updateTimeout;
  function updatePosition() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      const currentRect = filterContainer.getBoundingClientRect();
      filterFloatingButton.style.left = currentRect.width + 'px';

      if (filterFloatingButton.style.display === 'block') {
        const activeInput = allInputs.find(input => input.checked);
        if (activeInput) {
          handleInputToggle(activeInput);
        }
      }
    }, 100);
  }

  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);
}

//Фильтр
const filterMob = document.querySelector('.top-catalog-detail__filter-mob');
const filterPanel = document.querySelector('.filter-catalog-detail');
const filterCloseBtn = document.querySelector('.filter-catalog-detail__close');
if (filterMob) {

  filterMob.addEventListener('click', function (e) {
    e.stopPropagation();
    document.documentElement.classList.add('filter-open');
    filterPanel.classList.add('filter-open');
  });

  if (filterCloseBtn) {
    filterCloseBtn.addEventListener('click', function () {
      document.documentElement.classList.remove('filter-open');
      filterPanel.classList.remove('filter-open');
    });
  }

  document.addEventListener('click', function (e) {
    const isClickInsideFilter = filterPanel.contains(e.target);
    const isClickOnFilterMob = filterMob === e.target || filterMob.contains(e.target);

    if (!isClickInsideFilter && !isClickOnFilterMob) {
      document.documentElement.classList.remove('filter-open');
      filterPanel.classList.remove('filter-open');
    }
  });
}

const viewButtons = document.querySelectorAll('.block-payment__button');
if (viewButtons.length) {
  function handleViewMode() {
    const isLargeScreen = window.innerWidth <= 1100;
    const activeButton = document.querySelector('.block-payment__button._active');

    if (isLargeScreen) {
      document.documentElement.classList.add('grid-active');

      viewButtons.forEach(btn => {
        btn.classList.remove('_active');
        if (btn.classList.contains('grid')) {
          btn.classList.add('_active');
        }
      });
    } else {
      if (activeButton && activeButton.classList.contains('grid')) {
        document.documentElement.classList.add('grid-active');
      } else {
        document.documentElement.classList.remove('grid-active');
      }

      if (!activeButton) {
        viewButtons[0].classList.add('_active');
      }
    }
  }

  viewButtons.forEach(button => {
    button.addEventListener('click', function () {
      viewButtons.forEach(btn => btn.classList.remove('_active'));
      this.classList.add('_active');

      if (this.classList.contains('grid')) {
        document.documentElement.classList.add('grid-active');
      } else {
        document.documentElement.classList.remove('grid-active');
      }
    });
  });

  window.addEventListener('resize', handleViewMode);
  document.addEventListener('DOMContentLoaded', handleViewMode);
  window.addEventListener('load', handleViewMode);
}

//Яндекс карта
//Функция для создания темной темы
function createDarkTheme() {
  return [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#263c3f" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6b9a76" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#212a37" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca5b3" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#1f2835" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#f3d19c" }]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{ "color": "#2f3948" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#515c6d" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#17263c" }]
    }
  ];
}
function initYandexMaps() {
  const map1 = document.querySelector('#map1');
  const map2 = document.querySelector('#map2');

  if (!map1 && !map2) {
    return;
  }

  if (typeof ymaps === 'undefined') {
    return;
  }

  ymaps.ready(function () {
    if (map1) {
      var myMap1 = new ymaps.Map('map1', {
        center: [55.699781, 37.619423],
        zoom: 9,
        controls: ['zoomControl'],
        behaviors: ['drag']
      }, {
        searchControlProvider: 'yandex#search'
      });

      // Применяем темную тему
      myMap1.options.set({
        suppressMapOpenBlock: true
      });

      // Устанавливаем темные стили
      myMap1.options.set('mapStyle', createDarkTheme());

      myMap1.geoObjects
        .add(new ymaps.Placemark([55.694843, 37.435023], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/icon/map.svg',
          iconImageSize: [105, 140],
          iconImageOffset: [-57, -137],
        }))
        .add(new ymaps.Placemark([55.831903, 37.411961], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/icon/map.svg',
          iconImageSize: [105, 140],
          iconImageOffset: [-57, -137],
        }))
        .add(new ymaps.Placemark([55.763338, 37.565466], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/icon/map.svg',
          iconImageSize: [105, 140],
          iconImageOffset: [-57, -137],
        }))
        .add(new ymaps.Placemark([55.763338, 37.565466], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/icon/map.svg',
          iconImageSize: [105, 140],
          iconImageOffset: [-57, -137],
        }))
        .add(new ymaps.Placemark([55.744522, 37.616378], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/icon/map.svg',
          iconImageSize: [105, 140],
          iconImageOffset: [-57, -137],
        }));
    }

    if (map2) {
      var myMap2 = new ymaps.Map('map2', {
        center: [55.694843, 37.435023],
        zoom: 9,
        controls: ['zoomControl'],
        behaviors: ['drag']
      }, {
        searchControlProvider: 'yandex#search'
      });

      // Применяем темную тему
      myMap2.options.set({
        suppressMapOpenBlock: true
      });

      // Устанавливаем темные стили
      myMap2.options.set('mapStyle', createDarkTheme());

      myMap2.geoObjects
        .add(new ymaps.Placemark([55.694843, 37.435023], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'img/map.svg',
          iconImageSize: [48, 64],
          iconImageOffset: [0, 0],
        }));
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  initYandexMaps();
});