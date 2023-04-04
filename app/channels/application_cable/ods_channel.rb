
class OdsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "ods_channel"
  end

  def unsubscribed

  end

end