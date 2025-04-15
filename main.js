$('.exchange__block-form').on('submit', function (event) {

    event.stopPropagation();
    event.preventDefault();

    let form = this,
        submit = $('.submit', form),
        data = new FormData(),
        files = $('input[type=file]')

    $('.submit', form).val('Отправка...');
    $('input, textarea', form).attr('disabled','');

    data.append('Crypto 1', $('[id="cr_send"]', form).html());
    data.append( 'Send', 		$('[name="u_send"]', form).val() );
    data.append('Crypto 2', $('[id="cr_receive"]', form).html());
    data.append( 'Receive', 		$('[name="u_receive"]', form).val() );
    data.append( 'receive-address', 		$('[name="receive-address"]', form).val() );
    data.append( 'E-mail', 		$('[name="E-mail"]', form).val() );
    data.append( 'referral_code', 		$('[name="referral_code"]', form).val() );



   

    files.each(function (key, file) {
        let cont = file.files;
        if ( cont ) {
            $.each( cont, function( key, value ) {
                data.append( key, value );
            });
        }
    });
    
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        xhr: function() {
            let myXhr = $.ajaxSettings.xhr();

            if ( myXhr.upload ) {
                myXhr.upload.addEventListener( 'progress', function(e) {
                    if ( e.lengthComputable ) {
                        let percentage = ( e.loaded / e.total ) * 100;
                            percentage = percentage.toFixed(0);
                        $('.submit', form)
                            .html( percentage + '%' );
                    }
                }, false );
            }

            return myXhr;
        },
        error: function( jqXHR, textStatus ) {
            // Тут выводим ошибку
        },
        complete: function() {
            // Тут можем что-то делать ПОСЛЕ успешной отправки формы
            console.log('Complete')
            form.reset() 
        }
    });

    return false;
});



  
