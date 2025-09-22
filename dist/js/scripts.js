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

AW.initSliderAbout = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: false,
    spaceBetween: 15,
    slidesPerView: 1,
    speed: 200,
    breakpoints: {
      900: {
        slidesPerView: 1.3,
        spaceBetween: 70,
        slideToClickedSlide: true,
        centeredSlides: true,
      },
      1400: {
        slidesPerView: 2,
        spaceBetween: 100,
        slideToClickedSlide: true,
        centeredSlides: true,
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

AW.initSliderParners = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: false,
    spaceBetween: 15,
    slidesPerView: 6,
    speed: 200,
    breakpoints: {
      1400: {
        spaceBetween: 30,
        slidesPerView: 3,
        grid: {
          rows: 2
        }
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

AW.initSliderProductDetail = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: false,
    spaceBetween: 20,
    slidesPerView: 1,
    centeredSlides: true,
    speed: 200,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
  });
}

AW.initSliderSeries = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 500,
    navigation: {
      nextEl: $navNext[0],
      prevEl: $navPrev[0],
    },
    pagination: {
      el: $el.find('.swiper-pagination')[0],
      clickable: true
    },
    on: {
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

AW.initSliderGallery = function ($el) {
  const $navNext = $el.find('.swiper-nav_next');
  const $navPrev = $el.find('.swiper-nav_prev');

  new Swiper($el[0], {
    loop: true,
    spaceBetween: 20,
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
      550: {
        slidesPerView: 2,
        spaceBetween: 12
      },
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

AW.initSliderRecommend3 = function ($el) {
  const $slider = $el;
  const $topBlock = $el.closest('.block-recommend-product').find('.heading-cols1');
  const $navs = $el.find('.swiper-navs');
  const $navNext = $navs.find('.swiper-nav_next');
  const $navPrev = $navs.find('.swiper-nav_prev');

  function moveNavigation() {
    if (window.innerWidth >= 1100) {
      if (!$navs.parent().is('.heading-cols1')) {
        $navs.detach().appendTo($topBlock);
      }
    } else {
      if (!$navs.parent().is('.swiper-recommend3')) {
        $navs.detach().appendTo($slider);
      }
    }
  }

  const swiper = new Swiper($el[0], {
    loop: true,
    spaceBetween: 8,
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
      550: {
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

  $('.top-product-detail__slider').each(function () {
    AW.initSliderProductDetail($(this));
  });

  $('.swiper-publications').each(function () {
    AW.initSliderPublicationsOther($(this));
  });

  $('.block-series-descr__slider').each(function () {
    AW.initSliderSeries($(this));
  });

  $('.swiper-recommend').each(function () {
    AW.initSliderRecommend($(this));
  });

  $('.block-about-partners__slider').each(function () {
    AW.initSliderParners($(this));
  });


  $('.swiper-recommend2').each(function () {
    AW.initSliderRecommend2($(this));
  });

  $('.swiper-recommend3').each(function () {
    AW.initSliderRecommend3($(this));
  });

  $('.shops-gallery').each(function () {
    AW.initSliderGalleryShops($(this));
  });

  $('.block-media-detail__slider').each(function () {
    AW.initSliderGalleryMedia($(this));
  });

  $('.block-about-photo__slider').each(function () {
    AW.initSliderAbout($(this));
  });

  $('.block-gallery__slider').each(function () {
    AW.initSliderGallery($(this));
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

  $('[data-stepcounter]').each(function () {
    new AW.StepCounter($(this));
  });

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

  $('[data-select2]').each(function () {
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
             <div class="top-catalog-detail__arrows">
                                            <button class="sort-arrow up _active"
                                                aria-label="Сортировка по возрастанию">
                                                <svg aria-hidden="true" width="11" height="18">
                                                    <use xlink:href="img/sprite.svg#arrow3"></use>
                                                </svg>
                                            </button>
                                            <button class="sort-arrow down" aria-label="Сортировка по убыванию">
                                                <svg aria-hidden="true" width="11" height="18">
                                                    <use xlink:href="img/sprite.svg#arrow3"></use>
                                                </svg>
                                            </button>
                                        </div>
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
        <svg aria-hidden="true" width="21" height="16">
          <use xlink:href="img/sprite.svg#filter"></use>
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

      case 'toggleFormEdit': {
        const $container = $(this).closest('.edit-container');
        $container.toggleClass('edit-container_edit');
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

    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');

    priceStart.addEventListener('change', function () {
      ratingSearch.noUiSlider.set([this.value, null]);
    });

    priceEnd.addEventListener('change', function () {
      ratingSearch.noUiSlider.set([null, this.value]);
    });

    ratingSearch.noUiSlider.on('update', function (values, handle) {
      var value = values[handle].replace(' ₽', '');

      if (handle) {
        priceEnd.value = value;
      } else {
        priceStart.value = value;
      }
    });

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

const searchButton = document.querySelector('.search-button');
const searchBlock = document.querySelector('.map-block-payment__left .search');
if (searchButton) {
  searchButton.addEventListener('click', function () {
    searchBlock.classList.toggle('_active');
    this.classList.toggle('_active');
  });
}

window.removeSimplebarOnMobile = function () {
  const element = document.querySelector('.map-block-payment__shops');
  if (!element) return;

  if (window.innerWidth <= 992) {
    element.removeAttribute('data-simplebar');
    element.classList.remove('simplebar');
    element.style.overflow = 'auto';
    element.style.height = 'auto';

    const wrapper = element.querySelector('.simplebar-wrapper');
    if (wrapper) {
      const content = element.querySelector('.simplebar-content');
      if (content) {
        while (content.firstChild) {
          element.appendChild(content.firstChild);
        }
      }
      wrapper.remove();
    }
  } else {
    if (!element.hasAttribute('data-simplebar')) {
      element.setAttribute('data-simplebar', '');
    }
  }
}

function activateShopColumn(shopId) {
  if (window.innerWidth > 992) {
    return;
  }

  const shopColumns = document.querySelectorAll('.list-block-shops__column');
  shopColumns.forEach(column => {
    column.classList.remove('_active');
  });

  const targetColumn = document.querySelector(`.list-block-shops__column[data-shop-id="${shopId}"]`);
  if (targetColumn) {
    targetColumn.classList.add('_active');
  }
}

function deactivateAllShopColumns() {
  const shopColumns = document.querySelectorAll('.list-block-shops__column');
  shopColumns.forEach(column => {
    column.classList.remove('_active');
  });
}

function scrollToShopColumn(shopId) {
  const targetColumn = document.querySelector(`.list-block-shops__column[data-shop-id="${shopId}"]`);

  if (targetColumn) {
    // Простой и надежный способ прокрутки
    targetColumn.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });

    highlightShopColumn(shopId);
  }
}
function highlightShopColumn(shopId) {
  const targetColumn = document.querySelector(`.list-block-shops__column[data-shop-id="${shopId}"]`);

  if (targetColumn) {
    // Убираем подсветку со всех элементов
    const allColumns = document.querySelectorAll('.list-block-shops__column');
    allColumns.forEach(column => {
      column.classList.remove('_highlighted');
    });

    // Добавляем подсветку к целевому элементу
    targetColumn.classList.add('_highlighted');

    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      targetColumn.classList.remove('_highlighted');
    }, 2000);
  }
}
function initShopMapButtons() {
  const mapButtons = document.querySelectorAll('.btn-text-map');
  mapButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      if (window.innerWidth > 992) {
        return;
      }

      const column = this.closest('.list-block-shops__column');
      if (column) {
        const shopId = column.getAttribute('data-shop-id');
        activateShopColumn(shopId);
      }
    });
  });
}
// Яндекс карта
function initYandexMaps() {
  const map1 = document.querySelector('#map1');
  const map2 = document.querySelector('#map2');
  const map3 = document.querySelector('#map3');
  const map4 = document.querySelector('#map4');

  if (!map1 && !map2 && !map3 && !map4) {
    return;
  }

  if (typeof ymaps === 'undefined') {
    return;
  }

  ymaps.ready(function () {
    if (map1) {
      var myMap1 = new ymaps.Map('map1', {
        center: [55.682920, 37.551447],
        zoom: 10,
        controls: ['zoomControl'],
        behaviors: ['drag']
      }, {
        searchControlProvider: 'yandex#search'
      });

      myMap1.options.set('theme', 'dark');

      const placemarks = [
        {
          coords: [55.682920, 37.551447],
          shopId: 'shop-1'
        },
        {
          coords: [55.674337, 37.564862],
          shopId: 'shop-2'
        },
        {
          coords: [55.809955, 37.568524],
          shopId: 'shop-3'
        }
      ];

      placemarks.forEach((placemark) => {
        const mark = new ymaps.Placemark(placemark.coords, {
          shopId: placemark.shopId
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'img/map2.svg',
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -20],
        });

        mark.events.add('click', function (e) {
          const targetPlacemark = e.get('target');
          const shopId = targetPlacemark.properties.get('shopId');

          if (shopId) {
            if (window.innerWidth <= 992) {
              activateShopColumn(shopId);
            } else {
              scrollToShopColumn(shopId);
            }
            myMap1.panTo(targetPlacemark.geometry.getCoordinates(), {
              duration: 300
            });
          }
        });

        myMap1.geoObjects.add(mark);
      });
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

      myMap2.options.set('theme', 'dark');

      const mark = new ymaps.Placemark([55.694843, 37.435023], {
        shopId: 'map2-shop-1'
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map.svg',
        iconImageSize: [48, 64],
        iconImageOffset: [-24, -64],
      });

      mark.events.add('click', function (e) {
        const targetPlacemark = e.get('target');
        const shopId = targetPlacemark.properties.get('shopId');

        if (shopId) {
          if (window.innerWidth <= 992) {
            activateShopColumn(shopId);
          } else {
            scrollToShopColumn(shopId);
          }
        }
      });

      myMap2.geoObjects.add(mark);
    }

    if (map3) {
      var myMap3 = new ymaps.Map('map3', {
        center: [55.738049, 37.543731],
        zoom: 14,
        controls: ['zoomControl'],
        behaviors: ['drag']
      }, {
        searchControlProvider: 'yandex#search'
      });

      myMap3.options.set('theme', 'dark');

      const mark = new ymaps.Placemark([55.738049, 37.543731], {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map.svg',
        iconImageSize: [48, 64],
        iconImageOffset: [-24, -64],
      });

      myMap3.geoObjects.add(mark);
    }

    if (map4) {
      var myMap4 = new ymaps.Map('map4', {
        center: [55.738049, 37.543731],
        zoom: 14,
        controls: ['zoomControl'],
        behaviors: ['drag']
      }, {
        searchControlProvider: 'yandex#search'
      });

      window.myMap4 = myMap4;
      myMap4.options.set('theme', 'dark');

      const mark = new ymaps.Placemark([55.738049, 37.543731], {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/map2.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -20],
      });

      myMap4.geoObjects.add(mark);

      myMap4.container.fitToViewport();
    }
  });
}
function updateMapSize() {
  if (typeof window.myMap4 !== 'undefined') {
    window.myMap4.container.fitToViewport();
  }
}
function initShopMap() {
  function initAll() {
    initYandexMaps();
    initShopMapButtons();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMapSize, 250);
    });

    window.addEventListener('load', updateMapSize);
  }

  initAll();
}
document.addEventListener('DOMContentLoaded', function () {
  if (typeof removeSimplebarOnMobile === 'function') {
    removeSimplebarOnMobile();
  }

  initShopMap();

  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 992 &&
      !e.target.closest('.map-block-payment__right') &&
      !e.target.closest('.btn-text-map') &&
      !e.target.closest('.list-block-shops__column._active')) {
      deactivateAllShopColumns();
    }
  });
});
window.addEventListener('resize', function () {
  if (typeof removeSimplebarOnMobile === 'function') {
    removeSimplebarOnMobile();
  }

  if (window.innerWidth > 992) {
    deactivateAllShopColumns();
  }
});

document.querySelectorAll('input[type="radio"].radio__input').forEach(radio => {
  const label = radio.closest('.checkbox-text');
  const targetClass = label ? label.getAttribute('data-target') : null;

  if (targetClass) {
    if (radio.checked) {
      label.classList.add('checked');
      document.querySelector(targetClass)?.classList.add('_active');
    }

    radio.addEventListener('change', () => {
      document.querySelectorAll('.checkbox-text').forEach(el => {
        el.classList.remove('checked');
        const target = el.getAttribute('data-target');
        if (target) document.querySelector(target)?.classList.remove('_active');
      });

      if (radio.checked) {
        label.classList.add('checked');
        document.querySelector(targetClass)?.classList.add('_active');
      }
    });
  }

  if (radio.checked) {
    radio.closest('.checkbox-text').classList.add('checked');
  }

  radio.addEventListener('change', () => {
    document.querySelectorAll('.checkbox-text').forEach(el => {
      el.classList.remove('checked');
    });

    if (radio.checked) {
      radio.closest('.checkbox-text').classList.add('checked');
    }
  });
});

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

// Показать еще
function initShowMoreByItems(containerSelector, itemSelector, buttonSelector, itemsToShow, breakpoint = null) {
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach(container => {
    const content = container.querySelector('[data-showmore-content]');
    const button = container.querySelector(buttonSelector);
    const items = Array.from(content.querySelectorAll(itemSelector));
    let clickHandlerAdded = false;
    let isManualToggle = false;
    let initialHeight = 0;

    function calculateInitialHeight() {
      content.style.height = 'auto';
      content.style.overflow = 'hidden';

      items.forEach((item, index) => {
        if (index >= itemsToShow) {
          item.style.visibility = 'hidden';
          item.style.position = 'absolute';
          item.style.top = '-9999px';
        }
      });

      initialHeight = Array.from(items)
        .slice(0, itemsToShow)
        .reduce((sum, item) => sum + item.offsetHeight, 0);

      items.forEach((item, index) => {
        if (index >= itemsToShow) {
          item.style.visibility = '';
          item.style.position = '';
          item.style.top = '';
        }
      });

      content.style.height = initialHeight + 'px';
    }

    function checkItemsCount() {
      if (items.length <= itemsToShow) {
        button.setAttribute('hidden', 'true');
      } else {
        button.removeAttribute('hidden');
      }
    }

    function handleShowMoreClick() {
      isManualToggle = true;
      const isActive = button.classList.contains('_showmore-active');

      if (isActive) {
        _slideUp(content, 700, initialHeight);
        button.classList.remove('_showmore-active');
        container.classList.remove('_showmore-open');
      } else {
        content.style.height = 'auto';
        const fullHeight = content.offsetHeight;

        content.style.height = initialHeight + 'px';
        content.offsetHeight;

        content.style.transition = 'height 700ms ease';
        content.style.height = fullHeight + 'px';

        setTimeout(() => {
          content.style.height = '';
          content.style.transition = '';
          button.classList.add('_showmore-active');
          container.classList.add('_showmore-open');
        }, 700);
      }
    }

    function toggleShowMore() {
      if (breakpoint === null || window.innerWidth <= breakpoint) {
        if (!initialHeight && items.length > itemsToShow) {
          calculateInitialHeight();
        }

        if (!button.classList.contains('_showmore-active')) {
          content.style.height = initialHeight + 'px';
          container.classList.remove('_showmore-open');
        } else {
          content.style.height = 'auto';
          container.classList.add('_showmore-open');
        }

        if (!clickHandlerAdded) {
          button.addEventListener('click', handleShowMoreClick);
          clickHandlerAdded = true;
        }

        checkItemsCount();
      } else {
        content.style.height = 'auto';
        content.style.overflow = '';
        button.classList.remove('_showmore-active');
        button.setAttribute('hidden', 'true');
        container.classList.remove('_showmore-open');

        if (clickHandlerAdded) {
          button.removeEventListener('click', handleShowMoreClick);
          clickHandlerAdded = false;
        }

        isManualToggle = false;
      }
    }

    if (items.length > itemsToShow) {
      toggleShowMore();
    } else {
      button.setAttribute('hidden', 'true');
    }

    if (breakpoint !== null) {
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initialHeight = 0;
          toggleShowMore();
        }, 250);
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  initShowMoreByItems(
    '[data-showmore].block-support__texts',
    '.block-support__texts ul li',
    '[data-showmore-button]',
    1,
    1100
  );

  initShowMoreByItems(
    '[data-showmore].corners1__inner',
    '.block-product-descr__body > *',
    '[data-showmore-button]',
    2,
    null
  );

  initShowMoreByItems(
    '[data-showmore].block-series-compare__column',
    '.block-series-compare__item > *',
    '[data-showmore-button]',
    1,
    null
  );
});

// Функция для проверки позиции и скрытия/показа cart-fixed
function toggleFixedCart() {
  const fixedCart = document.querySelector('.cart-fixed');
  const detailCart = document.querySelector('.detail-cart');

  if (!fixedCart || !detailCart) return;

  const fixedCartRect = fixedCart.getBoundingClientRect();
  const detailCartRect = detailCart.getBoundingClientRect();

  if (fixedCartRect.bottom >= detailCartRect.top) {
    fixedCart.classList.remove("_active")
  } else {
    fixedCart.classList.add("_active")
  }
}

window.addEventListener('scroll', toggleFixedCart);
window.addEventListener('resize', toggleFixedCart);
toggleFixedCart();

// Функция для обновления высоты
function updateCompareTopHeight() {
  const leftTop = document.querySelector('.left-block-compare__top');
  const rightTop = document.querySelector('.right-block-compare__top');
  if (leftTop && rightTop) {
    const rightHeight = rightTop.offsetHeight;
    leftTop.style.height = `${rightHeight}px`;
  }
}
document.addEventListener('DOMContentLoaded', function () {
  updateCompareTopHeight();

  const rightTop = document.querySelector('.right-block-compare__top');

  if (rightTop) {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        updateCompareTopHeight();
      }
    });

    resizeObserver.observe(rightTop);
  }

  window.addEventListener('resize', updateCompareTopHeight);
});

// переход по якорным ссылкам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const hash = this.getAttribute('href');

    if (hash === '#characteristics') {
      e.preventDefault();

      const targetBlock = document.querySelector('.block-characteristics2');
      const headerHeight = document.querySelector('header')?.offsetHeight || 80; // Высота шапки

      if (targetBlock) {
        const targetPosition = targetBlock.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

/*
function initCompareSliders() {
  const itemsSlider = $('.compare-items__slider');
  const floatSlider = $('.compare-float-slider');
  if (!itemsSlider.length && !floatSlider.length) return;

  let mainSwiper = null;
  let floatSwiper = null;
  let mobileSwiper1 = null;
  let mobileSwiper2 = null;
  let floatMobileSwiper1 = null;
  let floatMobileSwiper2 = null;

  function syncDesktopSliders(activeIndex, sourceSwiper) {
    if (mainSwiper && mainSwiper !== sourceSwiper) {
      mainSwiper.slideTo(activeIndex);
    }

    if (floatSwiper && floatSwiper !== sourceSwiper) {
      floatSwiper.slideTo(activeIndex);
    }

    syncSpecsPosition(activeIndex);
  }

  function syncMobileSliders(activeIndex, sourceSwiper, isLeftSlider = true) {
    if (isLeftSlider) {
      if (mobileSwiper1 && mobileSwiper1 !== sourceSwiper) {
        mobileSwiper1.slideTo(activeIndex);
      }
      if (floatMobileSwiper1 && floatMobileSwiper1 !== sourceSwiper) {
        floatMobileSwiper1.slideTo(activeIndex);
      }

      updateMobileSpecs(activeIndex, true, false);
    } else {
      if (mobileSwiper2 && mobileSwiper2 !== sourceSwiper) {
        mobileSwiper2.slideTo(activeIndex);
      }
      if (floatMobileSwiper2 && floatMobileSwiper2 !== sourceSwiper) {
        floatMobileSwiper2.slideTo(activeIndex);
      }

      updateMobileSpecs(activeIndex, false, true);
    }
  }

  function syncSpecsPosition(activeIndex) {
    const $specsCols = $('.compare-specs__cols');
    let visibleSlides = 3;

    if (mainSwiper) {
      visibleSlides = mainSwiper.params.slidesPerView;
    } else if (floatSwiper) {
      visibleSlides = floatSwiper.params.slidesPerView;
    }

    $specsCols.each(function () {
      const $cols = $(this).find('.compare-specs__col').not(':first');

      $cols.each(function (index) {
        if (index >= activeIndex && index < activeIndex + visibleSlides) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  }

  function updateMobileSpecs(activeIndex, updateLeft = false, updateRight = false) {
    if (updateLeft) {
      const $leftCols = $('.compare-specs-mob__col_left');
      $leftCols.each(function () {
        const $divs = $(this).find('div');
        $divs.hide();
        if ($divs.length > activeIndex) {
          $divs.eq(activeIndex).show();
        }
      });
    }

    if (updateRight) {
      const $rightCols = $('.compare-specs-mob__col_right');
      $rightCols.each(function () {
        const $divs = $(this).find('div');
        $divs.hide();
        if ($divs.length > activeIndex) {
          $divs.eq(activeIndex).show();
        }
      });
    }
  }

  if (itemsSlider.length) {
    const $navNext = itemsSlider.closest('.compare-items__inner').find('.swiper-nav_next');
    const $navPrev = itemsSlider.closest('.compare-items__inner').find('.swiper-nav_prev');

    mainSwiper = new Swiper(itemsSlider[0], {
      spaceBetween: 30,
      slidesPerView: 3,
      speed: 200,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      breakpoints: {
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1400: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      },
      on: {
        init: function () {
          this.slides.forEach((slide, index) => {
            if (index < this.params.slidesPerView) {
              $(slide).addClass('swiper-slide-visible');
            }
          });
          syncSpecsPosition(this.activeIndex);
        },
        slideChangeTransitionEnd: function () {
          this.slides.forEach(slide => {
            $(slide).removeClass('swiper-slide-visible');
          });

          this.slides.forEach((slide, index) => {
            if (index >= this.activeIndex && index < this.activeIndex + this.params.slidesPerView) {
              $(slide).addClass('swiper-slide-visible');
            }
          });

          syncDesktopSliders(this.activeIndex, this);
        }
      }
    });
  }

  if (floatSlider.length) {
    const $navNext = floatSlider.closest('.compare-items__inner').find('.swiper-nav_next');
    const $navPrev = floatSlider.closest('.compare-items__inner').find('.swiper-nav_prev');

    floatSwiper = new Swiper(floatSlider[0], {
      spaceBetween: 30,
      slidesPerView: 3,
      speed: 200,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      breakpoints: {
        992: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1400: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      },
      on: {
        init: function () {
          this.slides.forEach((slide, index) => {
            if (index < this.params.slidesPerView) {
              $(slide).addClass('swiper-slide-visible');
            }
          });
          syncSpecsPosition(this.activeIndex);
        },
        slideChangeTransitionEnd: function () {
          this.slides.forEach(slide => {
            $(slide).removeClass('swiper-slide-visible');
          });

          this.slides.forEach((slide, index) => {
            if (index >= this.activeIndex && index < this.activeIndex + this.params.slidesPerView) {
              $(slide).addClass('swiper-slide-visible');
            }
          });

          syncDesktopSliders(this.activeIndex, this);
        }
      }
    });
  }

  const itemsSliderMobile1 = $('.compare-mobile1').not('.compare-float .compare-mobile1');
  if (itemsSliderMobile1.length) {
    const $navNext1 = itemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-nav_next');
    const $navPrev1 = itemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-nav_prev');
    const $label1 = itemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-compare-mobile__label');

    mobileSwiper1 = new Swiper(itemsSliderMobile1[0], {
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 200,
      navigation: {
        nextEl: $navNext1[0],
        prevEl: $navPrev1[0],
      },
      on: {
        init: function () {
          $label1.find('span').text(this.activeIndex + 1);
          updateMobileSpecs(this.activeIndex, true, false);
        },
        slideChange: function (s) {
          $label1.find('span').text(s.realIndex + 1);
          syncMobileSliders(s.realIndex, this, true);
        },
      },
    });
  }

  const itemsSliderMobile2 = $('.compare-mobile2').not('.compare-float .compare-mobile2');
  if (itemsSliderMobile2.length) {
    const $navNext2 = itemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-nav_next');
    const $navPrev2 = itemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-nav_prev');
    const $label2 = itemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-compare-mobile__label');

    mobileSwiper2 = new Swiper(itemsSliderMobile2[0], {
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 200,
      navigation: {
        nextEl: $navNext2[0],
        prevEl: $navPrev2[0],
      },
      on: {
        init: function () {
          $label2.find('span').text(this.activeIndex + 1);
          updateMobileSpecs(this.activeIndex, false, true);
        },
        slideChange: function (s) {
          $label2.find('span').text(s.realIndex + 1);
          syncMobileSliders(s.realIndex, this, false);
        },
      },
    });
  }

  const floatItemsSliderMobile1 = $('.compare-float .compare-mobile1');
  if (floatItemsSliderMobile1.length) {
    const $navNext1 = floatItemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-nav_next');
    const $navPrev1 = floatItemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-nav_prev');
    const $label1 = floatItemsSliderMobile1.closest('.compare-mobile__slider').find('.swiper-compare-mobile__label');

    floatMobileSwiper1 = new Swiper(floatItemsSliderMobile1[0], {
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 200,
      navigation: {
        nextEl: $navNext1[0],
        prevEl: $navPrev1[0],
      },
      on: {
        init: function () {
          $label1.find('span').text(this.activeIndex + 1);
          updateMobileSpecs(this.activeIndex, true, false);
        },
        slideChange: function (s) {
          $label1.find('span').text(s.realIndex + 1);
          syncMobileSliders(s.realIndex, this, true);
        },
      },
    });
  }

  const floatItemsSliderMobile2 = $('.compare-float .compare-mobile2');
  if (floatItemsSliderMobile2.length) {
    const $navNext2 = floatItemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-nav_next');
    const $navPrev2 = floatItemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-nav_prev');
    const $label2 = floatItemsSliderMobile2.closest('.compare-mobile__slider').find('.swiper-compare-mobile__label');

    floatMobileSwiper2 = new Swiper(floatItemsSliderMobile2[0], {
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 200,
      navigation: {
        nextEl: $navNext2[0],
        prevEl: $navPrev2[0],
      },
      on: {
        init: function () {
          $label2.find('span').text(this.activeIndex + 1);
          updateMobileSpecs(this.activeIndex, false, true);
        },
        slideChange: function (s) {
          $label2.find('span').text(s.realIndex + 1);
          syncMobileSliders(s.realIndex, this, false);
        },
      },
    });
  }

  function initSpecsSync() {
    const $specsContainer = $('.compare-specs__inner');
    const $specsCols = $('.compare-specs__cols');

    $specsContainer.on('scroll', function () {
      const scrollLeft = $specsContainer.scrollLeft();
      const colWidth = $specsCols.first().outerWidth();
      const activeIndex = Math.round(scrollLeft / colWidth);

      syncDesktopSliders(activeIndex, null);
    });
  }

  initSpecsSync();

  if (mainSwiper) {
    syncSpecsPosition(mainSwiper.activeIndex);
  } else if (floatSwiper) {
    syncSpecsPosition(floatSwiper.activeIndex);
  }

  $(window).on('resize', function () {
    if (mainSwiper) {
      syncSpecsPosition(mainSwiper.activeIndex);
    } else if (floatSwiper) {
      syncSpecsPosition(floatSwiper.activeIndex);
    }
  });
}
initCompareSliders();
*/
function initCompareSliders() {
  const itemsSlider = $('.compare-items__slider');
  const floatSlider = $('.compare-float-slider');
  if (!itemsSlider.length && !floatSlider.length) return;

  let mainSwiper = null;
  let floatSwiper = null;
  let mobileSwiper1 = null;
  let mobileSwiper2 = null;
  let floatMobileSwiper1 = null;
  let floatMobileSwiper2 = null;
  let specsSwiper = null;
  let specsMobSwiper = null;

  function syncDesktopSliders(activeIndex, sourceSwiper) {
    if (mainSwiper && mainSwiper.initialized && mainSwiper !== sourceSwiper) {
      mainSwiper.slideTo(activeIndex);
    }

    if (floatSwiper && floatSwiper.initialized && floatSwiper !== sourceSwiper) {
      floatSwiper.slideTo(activeIndex);
    }

    if (specsSwiper && specsSwiper.initialized && specsSwiper !== sourceSwiper) {
      specsSwiper.slideTo(activeIndex);
    }

    syncSpecsPosition(activeIndex);
  }

  function syncMobileSliders(activeIndex, sourceSwiper, isLeftSlider = true) {
    if (isLeftSlider) {
      if (mobileSwiper1 && mobileSwiper1.initialized && mobileSwiper1 !== sourceSwiper) {
        mobileSwiper1.slideTo(activeIndex);
      }
      if (floatMobileSwiper1 && floatMobileSwiper1.initialized && floatMobileSwiper1 !== sourceSwiper) {
        floatMobileSwiper1.slideTo(activeIndex);
      }
    } else {
      if (mobileSwiper2 && mobileSwiper2.initialized && mobileSwiper2 !== sourceSwiper) {
        mobileSwiper2.slideTo(activeIndex);
      }
      if (floatMobileSwiper2 && floatMobileSwiper2.initialized && floatMobileSwiper2 !== sourceSwiper) {
        floatMobileSwiper2.slideTo(activeIndex);
      }
    }

    if (specsMobSwiper && specsMobSwiper.initialized && specsMobSwiper !== sourceSwiper) {
      specsMobSwiper.slideTo(activeIndex);
    }

    updateMobileSpecs(activeIndex, isLeftSlider, !isLeftSlider);
  }

  function syncSpecsPosition(activeIndex) {
    const $specsCols = $('.compare-specs__cols');
    if (!$specsCols.length) return;

    let visibleSlides = 3;

    if (mainSwiper && mainSwiper.initialized) {
      visibleSlides = mainSwiper.params.slidesPerView;
    } else if (floatSwiper && floatSwiper.initialized) {
      visibleSlides = floatSwiper.params.slidesPerView;
    }

    $specsCols.each(function () {
      const $cols = $(this).find('.compare-specs__col').not(':first');

      $cols.each(function (index) {
        if (index >= activeIndex && index < activeIndex + visibleSlides) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  }

  function updateMobileSpecs(activeIndex, updateLeft = false, updateRight = false) {
    if (updateLeft) {
      const $leftCols = $('.compare-specs-mob__col_left');
      $leftCols.each(function () {
        const $divs = $(this).find('div');
        $divs.hide();
        if ($divs.length > activeIndex) {
          $divs.eq(activeIndex).show();
        }
      });
    }

    if (updateRight) {
      const $rightCols = $('.compare-specs-mob__col_right');
      $rightCols.each(function () {
        const $divs = $(this).find('div');
        $divs.hide();
        if ($divs.length > activeIndex) {
          $divs.eq(activeIndex).show();
        }
      });
    }
  }

  // Инициализация свайпера для desktop таблицы характеристик
  function initSpecsSwiper() {
    const $specsContainer = $('.compare-specs__inner');
    if ($specsContainer.length && $specsContainer[0]) {
      try {
        specsSwiper = new Swiper($specsContainer[0], {
          freeMode: true,
          slidesPerView: 'auto',
          resistanceRatio: 0,
          slideToClickedSlide: false,
          observer: true,
          observeSlideChildren: true,
          observeParents: true,
          on: {
            init: function () {
              this.initialized = true;
            },
            slideChange: function () {
              if (!this.initialized) return;
              const scrollLeft = $specsContainer.scrollLeft();
              const $firstCol = $('.compare-specs__cols').first();
              if (!$firstCol.length) return;

              const colWidth = $firstCol.outerWidth();
              const activeIndex = Math.round(scrollLeft / colWidth);

              syncDesktopSliders(activeIndex, this);
            }
          }
        });
        specsSwiper.initialized = true;
      } catch (error) {
        console.error('Error initializing specs swiper:', error);
      }
    }
  }

  // Инициализация свайпера для mobile таблицы характеристик
  function initSpecsMobSwiper() {
    const $specsMobContainer = $('.compare-specs-mob');
    if ($specsMobContainer.length && $specsMobContainer[0]) {
      try {
        specsMobSwiper = new Swiper($specsMobContainer[0], {
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 20,
          resistanceRatio: 0,
          observer: true,
          observeSlideChildren: true,
          observeParents: true,
          on: {
            init: function () {
              this.initialized = true;
            },
            slideChange: function () {
              if (!this.initialized) return;
              syncMobileSliders(this.activeIndex, this, true);
            }
          }
        });
        specsMobSwiper.initialized = true;
      } catch (error) {
        console.error('Error initializing mobile specs swiper:', error);
      }
    }
  }

  // Инициализация основного слайдера
  if (itemsSlider.length && itemsSlider[0]) {
    const $navNext = itemsSlider.closest('.compare-items__inner').find('.swiper-nav_next');
    const $navPrev = itemsSlider.closest('.compare-items__inner').find('.swiper-nav_prev');

    try {
      mainSwiper = new Swiper(itemsSlider[0], {
        spaceBetween: 30,
        slidesPerView: 3,
        speed: 200,
        navigation: {
          nextEl: $navNext.length ? $navNext[0] : null,
          prevEl: $navPrev.length ? $navPrev[0] : null,
        },
        observer: true,
        observeSlideChildren: true,
        observeParents: true,
        breakpoints: {
          992: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1400: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        },
        on: {
          init: function () {
            this.initialized = true;
            this.slides.forEach((slide, index) => {
              if (index < this.params.slidesPerView) {
                $(slide).addClass('swiper-slide-visible');
              }
            });
            syncSpecsPosition(this.activeIndex);
          },
          slideChangeTransitionEnd: function () {
            if (!this.initialized) return;
            this.slides.forEach(slide => {
              $(slide).removeClass('swiper-slide-visible');
            });

            this.slides.forEach((slide, index) => {
              if (index >= this.activeIndex && index < this.activeIndex + this.params.slidesPerView) {
                $(slide).addClass('swiper-slide-visible');
              }
            });

            syncDesktopSliders(this.activeIndex, this);
          }
        }
      });
      mainSwiper.initialized = true;
    } catch (error) {
      console.error('Error initializing main swiper:', error);
    }
  }

  // Инициализация плавающего слайдера
  if (floatSlider.length && floatSlider[0]) {
    const $navNext = floatSlider.closest('.compare-items__inner').find('.swiper-nav_next');
    const $navPrev = floatSlider.closest('.compare-items__inner').find('.swiper-nav_prev');

    try {
      floatSwiper = new Swiper(floatSlider[0], {
        spaceBetween: 30,
        slidesPerView: 3,
        speed: 200,
        navigation: {
          nextEl: $navNext.length ? $navNext[0] : null,
          prevEl: $navPrev.length ? $navPrev[0] : null,
        },
        observer: true,
        observeSlideChildren: true,
        observeParents: true,
        breakpoints: {
          992: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1400: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        },
        on: {
          init: function () {
            this.initialized = true;
            this.slides.forEach((slide, index) => {
              if (index < this.params.slidesPerView) {
                $(slide).addClass('swiper-slide-visible');
              }
            });
            syncSpecsPosition(this.activeIndex);
          },
          slideChangeTransitionEnd: function () {
            if (!this.initialized) return;
            this.slides.forEach(slide => {
              $(slide).removeClass('swiper-slide-visible');
            });

            this.slides.forEach((slide, index) => {
              if (index >= this.activeIndex && index < this.activeIndex + this.params.slidesPerView) {
                $(slide).addClass('swiper-slide-visible');
              }
            });

            syncDesktopSliders(this.activeIndex, this);
          }
        }
      });
      floatSwiper.initialized = true;
    } catch (error) {
      console.error('Error initializing float swiper:', error);
    }
  }

  // Инициализация мобильных слайдеров
  function initMobileSwiper(selector, isFirst = true) {
    const $slider = $(selector);
    if ($slider.length && $slider[0]) {
      const $navNext = $slider.closest('.compare-mobile__slider').find('.swiper-nav_next');
      const $navPrev = $slider.closest('.compare-mobile__slider').find('.swiper-nav_prev');
      const $label = $slider.closest('.compare-mobile__slider').find('.swiper-compare-mobile__label');

      try {
        const swiper = new Swiper($slider[0], {
          spaceBetween: 0,
          slidesPerView: 1,
          speed: 200,
          navigation: {
            nextEl: $navNext.length ? $navNext[0] : null,
            prevEl: $navPrev.length ? $navPrev[0] : null,
          },
          observer: true,
          observeSlideChildren: true,
          observeParents: true,
          on: {
            init: function () {
              this.initialized = true;
              if ($label.length) {
                $label.find('span').text(this.activeIndex + 1);
              }
              updateMobileSpecs(this.activeIndex, isFirst, !isFirst);
            },
            slideChange: function (s) {
              if (!this.initialized) return;
              if ($label.length) {
                $label.find('span').text(s.realIndex + 1);
              }
              syncMobileSliders(s.realIndex, this, isFirst);
            },
          },
        });
        swiper.initialized = true;
        return swiper;
      } catch (error) {
        console.error('Error initializing mobile swiper:', error);
        return null;
      }
    }
    return null;
  }

  // Инициализация всех мобильных слайдеров
  mobileSwiper1 = initMobileSwiper('.compare-mobile1:not(.compare-float .compare-mobile1)', true);
  mobileSwiper2 = initMobileSwiper('.compare-mobile2:not(.compare-float .compare-mobile2)', false);
  floatMobileSwiper1 = initMobileSwiper('.compare-float .compare-mobile1', true);
  floatMobileSwiper2 = initMobileSwiper('.compare-float .compare-mobile2', false);

  // Инициализация свайперов для таблиц характеристик
  initSpecsSwiper();
  initSpecsMobSwiper();

  // Функция для обработки свайпа на таблицах
  function initManualSwipe() {
    // Для desktop таблицы
    const $specsInner = $('.compare-specs__inner');
    if ($specsInner.length) {
      let isScrolling = false;
      let startX = 0;
      let scrollLeft = 0;

      $specsInner.on('mousedown touchstart', function (e) {
        isScrolling = true;
        startX = (e.pageX || e.originalEvent.touches[0].pageX) - $specsInner.offset().left;
        scrollLeft = $specsInner.scrollLeft();
      });

      $specsInner.on('mousemove touchmove', function (e) {
        if (!isScrolling) return;
        e.preventDefault();
        const x = (e.pageX || e.originalEvent.touches[0].pageX) - $specsInner.offset().left;
        const walk = (x - startX) * 2;
        $specsInner.scrollLeft(scrollLeft - walk);
      });

      $specsInner.on('mouseup touchend mouseleave', function () {
        isScrolling = false;
      });
    }

    // Для mobile таблицы
    const $specsMob = $('.compare-specs-mob');
    if ($specsMob.length) {
      let startXMob = 0;
      let startYMob = 0;
      let isHorizontalMob = false;

      $specsMob.on('touchstart', function (e) {
        startXMob = e.originalEvent.touches[0].pageX;
        startYMob = e.originalEvent.touches[0].pageY;
        isHorizontalMob = false;
      });

      $specsMob.on('touchmove', function (e) {
        if (!isHorizontalMob) {
          const xMove = e.originalEvent.touches[0].pageX - startXMob;
          const yMove = e.originalEvent.touches[0].pageY - startYMob;

          if (Math.abs(xMove) > Math.abs(yMove)) {
            isHorizontalMob = true;
            e.preventDefault();
          }
        } else {
          e.preventDefault();
          const xMove = e.originalEvent.touches[0].pageX - startXMob;

          if (xMove > 50 && specsMobSwiper && specsMobSwiper.initialized && specsMobSwiper.activeIndex > 0) {
            specsMobSwiper.slidePrev();
            startXMob = e.originalEvent.touches[0].pageX;
          } else if (xMove < -50 && specsMobSwiper && specsMobSwiper.initialized && specsMobSwiper.activeIndex < specsMobSwiper.slides.length - 1) {
            specsMobSwiper.slideNext();
            startXMob = e.originalEvent.touches[0].pageX;
          }
        }
      });
    }
  }

  // Задержка инициализации свайпа для обеспечения готовности DOM
  setTimeout(() => {
    initManualSwipe();
  }, 100);

  // Инициализация позиции при загрузке
  setTimeout(() => {
    if (mainSwiper && mainSwiper.initialized) {
      syncSpecsPosition(mainSwiper.activeIndex);
    } else if (floatSwiper && floatSwiper.initialized) {
      syncSpecsPosition(floatSwiper.activeIndex);
    }
  }, 200);

  $(window).on('resize', function () {
    setTimeout(() => {
      if (mainSwiper && mainSwiper.initialized) {
        syncSpecsPosition(mainSwiper.activeIndex);
      } else if (floatSwiper && floatSwiper.initialized) {
        syncSpecsPosition(floatSwiper.activeIndex);
      }
    }, 100);
  });
}
initCompareSliders()

const compareFloat = document.querySelector('.compare-float');
if (compareFloat) {
  function toggleCompareFloatClass() {
    if (window.scrollY > 700) {
      compareFloat.classList.add('_active');
    } else {
      compareFloat.classList.remove('_active');
    }
  }
  window.addEventListener('scroll', toggleCompareFloatClass);
  toggleCompareFloatClass();
}

const productFloat = document.querySelector('.fixed-product');
if (productFloat) {
  function toggleproductFloat() {
    if (window.scrollY > 700) {
      productFloat.classList.add('_active');
    } else {
      productFloat.classList.remove('_active');
    }
  }
  window.addEventListener('scroll', toggleproductFloat);
  toggleproductFloat();
}

//Изменить магазин
const changeStoreButton = document.querySelector('.change-store');

if (changeStoreButton) {
  changeStoreButton.addEventListener('click', function () {
    const parentBlock = this.closest('.self-delivery-block__body');

    if (parentBlock) {
      parentBlock.classList.add('_active');
    }
  });
}