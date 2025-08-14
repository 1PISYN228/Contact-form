const successBlockElement = document.querySelector("[data-js-success-block]")


class ValidityForm {
    selectors = {
        form: "[data-js-form]",
        messageErrors: "[data-js-form-field-errors]",
        successBlock: "[data-js-success-block]",
    }


    errorMessages = {
        tooLong: () => "This field is too long!",
        tooShort: () => "This field is too short!",
        patternMismatch: () => "Please enter a valid email address!",
        valueMissing: ({ type }) => type === "checkbox" ? "To submit this form, please consent to being contacted!" 
        : type === "radio" ? "Please select a query type!" : "This field is required!",
    }


    constructor () {
        this.bindEvents()
    }


    // manageErrors(fieldFormElement, errorMessages) {
    //     const fieldErrorsElement = fieldFormElement.parentElement.querySelector(this.selectors.messageErrors)
    //     fieldErrorsElement.textContent = errorMessages.map((message) => `${message}`).join(" ")
    // }
    manageErrors(fieldFormElement, errorMessages) {
    const fieldWrapper = fieldFormElement.closest(".group") || fieldFormElement.parentElement.querySelector(this.selectors.messageErrors)
    const fieldErrorsElement = fieldWrapper.querySelector(this.selectors.messageErrors);
    if (fieldErrorsElement) {
        fieldErrorsElement.textContent = errorMessages.join(" ");
        } 
    }


    validateForm(fieldFormElement) {
        const errors = fieldFormElement.validity
        const errorMessages = []
        Object.entries(this.errorMessages).forEach(([errorType, errorMessage]) => {
            if (errors[errorType]) {
                errorMessages.push(errorMessage(fieldFormElement))
                fieldFormElement.classList.add("border-red-600")
            }
        })
        this.manageErrors(fieldFormElement, errorMessages)

        const isValid = errorMessages.length === 0

        fieldFormElement.ariaInvalid = !isValid

        return isValid
    }


    onBlur(event) {
        const { target } = event
        const isFormElement = target.closest(this.selectors.form)
        const isRequired = target.required
        if (isFormElement && isRequired) {
            this.validateForm(target)
        }
    }

    onChange(event) {
        const { target } = event

        const isRequired = target.required
        const isToggleType = ["radio", "checkbox"].includes(target.type)

        if (isRequired && isToggleType) {
            this.validateForm(target)
        }
    }


    onSubmit(event) {
        const { target } = event
        event.preventDefault()
        const isFormElement = target.matches(this.selectors.form)

        if (!isFormElement) {
            return
        }

        const requiredControlElements = [...target.elements].filter(({ required }) => required)

        let isFormValid = true
        let firstInvaludFieldControl = null

        requiredControlElements.forEach((element) => {
            const isFieldValid = this.validateForm(element)

            if (!isFieldValid) {
                isFormValid = false

                if (!firstInvaludFieldControl) {
                    firstInvaludFieldControl = element
                }
            }
        })


        if (isFormValid) {
            successBlockElement.classList.toggle("hidden")
            successBlockElement.classList.toggle("grid")
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            event.preventDefault()
            firstInvaludFieldControl.focus()
        }
    }

    onFocus(event) {
        event.target.classList.remove("border-red-600")
    }

    bindEvents() {
        document.addEventListener("blur", (event) => {
            this.onBlur(event)
        }, { capture:true} )
        document.addEventListener("change", (event) => {
            this.onChange(event)
        })
        document.addEventListener("submit", (event) => {
            this.onSubmit(event)
        })
        document.addEventListener("focus", (event) => {
            this.onFocus(event)
        }, { capture: true })
    }
}

new ValidityForm()


